import type { Request } from 'express';
import type { RequestContext } from '../application/request-context.js';

export type AuthenticatedRequest = Request & {
  requestContext: RequestContext;
};
