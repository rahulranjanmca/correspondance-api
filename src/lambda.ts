/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* node_modules */
import { SanitizeError } from '@wellmark/wm-lib-error-handler';
// import { Context, Handler } from 'aws-lambda';
// import { createServer, proxy } from 'aws-serverless-express';
import { proxy } from 'aws-serverless-express';
// import express from 'express';
import { Server } from 'http';

/* app */
import { bootstrap } from './app';
// const warmer = require('lambda-warmer');
/* libraries */
// import mongo from './lib/mongo';
//import soap from './lib/soap';
// import sql from './lib/sql';
/* boot */
import { load } from './boot';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below, then redeploy (`npm run package-deploy`)
// const binaryMimeTypes: string[] = [
//   /*
//   'application/javascript',
//   'application/json',
//   'application/octet-stream',
//   'application/xml',
//   'font/eot',
//   'font/opentype',
//   'font/otf',
//   'image/jpeg',
//   'image/png',
//   'image/svg+xml',
//   'text/comma-separated-values',
//   'text/css',
//   'text/html',
//   'text/javascript',
//   'text/plain',
//   'text/text',
//   'text/xml'
//   */
// ];

const booted: any = false;
let cachedServer: Server;

exports.handler = async (event: any, context: any) => {
  try {
    if (!booted) {
      await load(`node-starter-api`, { ssm: true });
    }

    if (!cachedServer) {
      cachedServer = await bootstrap();
    }

    return proxy(cachedServer, event, context, 'PROMISE').promise;
  } catch (err) {
    throw SanitizeError(err);
  }
};

// export const handler: Handler = async (event: any, context: Context) => {
//   if (!cachedServer) {
//     const expressApp = express();
//     cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
//   }

//   return proxy(cachedServer, event, context, 'PROMISE').promise;
// };
