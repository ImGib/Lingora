import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { RequestContext } from '../application/request-context.js';
import type { AuthenticatedRequest } from './authenticated-request.js';

export const CurrentRequestContext = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestContext =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().requestContext,
);
