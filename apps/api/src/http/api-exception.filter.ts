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

    const codes: Record<number, string> = {
      400: 'VALIDATION_FAILED', 401: 'AUTHENTICATION_REQUIRED', 403: 'FORBIDDEN',
      404: 'NOT_FOUND', 409: 'INVALID_TRANSITION', 422: 'RESPONSE_INCOMPLETE',
    };
    response.status(status).json({
      error: {
        code: codes[status] ?? 'REQUEST_FAILED',
        message,
        retryable: status >= 500,
        requestId,
        ...(status === 422 ? { nextAction: 'RESUME_ATTEMPT' } : {}),
        ...(detail && 'issues' in detail ? { issues: detail.issues } : {}),
      },
    });
  }
}
