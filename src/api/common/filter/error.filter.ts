import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { WmCccErrorDto } from '../dto/error.dto';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;
    if (status === HttpStatus.UNAUTHORIZED) {
      message = 'Token is missing or Invalid token';
    } else if (exception.message && exception.message.message) {
      message = exception.message.message;
    } else if (exception.message) {
      message = exception.message;
    } else {
      message = 'Internal Server Error';
    }

    response.status(status).send(new WmCccErrorDto(message));
  }
}
