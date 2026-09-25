export type RequestContext = Readonly<{
  learnerId: string;
  requestId: string;
}>;

export const REQUEST_CONTEXT = Symbol('REQUEST_CONTEXT');
