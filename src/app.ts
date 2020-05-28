/* eslint-disable @typescript-eslint/no-explicit-any */
/* node_modules */
/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DefaultErrorHandler, SanitizeError } from '@wellmark/wm-lib-error-handler';
import { createServer } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import bodyParser from 'body-parser';
import cors from 'cors';
import wait from 'delay';
import express from 'express';
import helmet from 'helmet';
import { Server } from 'http';
import morgan from 'morgan';
import responseTime from 'response-time';

import { AppModule } from './app.module';
import { bootLocalEnv } from './boot';
/* libraries */
import logger from './lib/logger/index';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import { CommonService } from './api/common/common.service';

const stagingEnvironment = require('@wellmark/wm-lib-runtime-environment').stagingEnvironment;

let exposeSwagger = false;
if (stagingEnvironment.currentEnvironmentIsLowerThan(stagingEnvironment.PREP)) exposeSwagger = true;

const binaryMimeTypes: string[] = [];
const PRE_DEATH_WAIT_SECONDS = 5;
let app;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function bootstrap() {
  try {
    const allowedOrigins = process.env.ALLOWED_ORIGINS;
    let corsOptions = {};
    if (process.env.DATACENTER_ENV !== 'AWS' && process.env.NODE_ENV !== 'LOCAL') {
      if (allowedOrigins) {
        const allowedOriginsList = allowedOrigins.split(';');
        corsOptions = {
          optionsSuccessStatus: 200,
          credentials: true,
          origin: (origin: any, callback: any) => {
            // origin of undefined is for the swagger docs page
            if (origin === undefined) return callback(undefined, true);
            // tslint:disable-next-line:no-increment-decrement
            for (let x = 0; x < allowedOriginsList.length; x++) {
              if (origin.toUpperCase().indexOf(allowedOriginsList[x].toUpperCase()) >= 0) {
                return callback(undefined, true);
              }
            }
            callback(new Error("Env variable 'ALLOWED_ORIGINS' must match origin index."));
          }
        };
      } else {
        throw new Error("Env variable 'ALLOWED_ORIGINS' must be defined for this process.");
      }
    } else {
      corsOptions = {
        optionsSuccessStatus: 200,
        credentials: true,
        origin: (_origin: any, callback: (arg0: any, arg1: boolean) => void) => callback(undefined, true)
      };
    }

    if (stagingEnvironment.isLocal()) require('longjohn');

    const expressApp = express();
    app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    app.setGlobalPrefix(process.env.SWAGGER_BASE_PATH as string);
    const options = new DocumentBuilder()
      .setTitle('Base API')
      .setDescription('Template API for starter projects')
      .setVersion('1.0')
      .addBearerAuth({ name: 'Authorization', type: 'apiKey', in: 'header', scheme: 'bearer', bearerFormat: 'bearer XXXXXXXXX' })
      .build();
    const document = SwaggerModule.createDocument(app, options);
    // disable UI in PREP/PROD
    if (exposeSwagger) SwaggerModule.setup(`${process.env.SWAGGER_BASE_PATH}/docs`, app, document);

    app.use(cors(corsOptions));
    app.use(morgan('combined', { skip: (_req, res) => res.statusCode < 400 }));
    app.use(helmet());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.raw({ limit: '50mb', type: 'application/pdf' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
    app.use(morgan('tiny'));
    app.use(responseTime());
    app.use(eventContext());
    app.use(DefaultErrorHandler);
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      skipMissingProperties: true,
      exceptionFactory: (errors: ValidationError[]) => {
        CommonService.throwBadRequestError(errors);
      }
    }))

    await app.init();
    if (stagingEnvironment.isLocal()) {
      const server = app.listen(process.env.PORT as string);
      bootLocalEnv();
      return server;
    }
    return createServer(expressApp, undefined, binaryMimeTypes) as Server;
  } catch (err) {
    logger.trace(`{}Boot::#killSelf::exiting process due to error::error=${SanitizeError(err)}`);
    if (stagingEnvironment.currentEnvironmentIsHigherThan(stagingEnvironment.LOCAL)) {
      // Let execution continue for logging before killing process
      wait(PRE_DEATH_WAIT_SECONDS);
    }
    process.exit(1);
  }
}
