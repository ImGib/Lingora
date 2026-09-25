import {
  Catch,
  HttpException,
  HttpStatus,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';
import { randomUUID } from 'node:crypto';
import type { AuthenticatedRequest } from './authenticated-request.js';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<AuthenticatedRequest>();
    const response = http.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const requestId = request.requestContext?.requestId ?? request.header('x-request-id') ?? randomUUID();
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const detail = typeof exceptionResponse === 'object' ? exceptionResponse : null;
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : status === 500
          ? 'An internal service error occurred.'
          : exception instanceof Error
            ? exception.message
            : 'Request failed.';

    response.status(status).json({
      error: {
        code: status === 401 ? 'AUTHENTICATION_REQUIRED' : status === 400 ? 'VALIDATION_FAILED' : 'REQUEST_FAILED',
        message,
        retryable: status >= 500,
        requestId,
        ...(detail && 'issues' in detail ? { issues: detail.issues } : {}),
      },
    });
  }
}
