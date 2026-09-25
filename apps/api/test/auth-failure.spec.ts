import { describe, expect, it, vi } from 'vitest';
import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '../src/http/auth.guard.js';

describe('technical failure semantics', () => {
  it('does not provision identity or create learning state when authentication fails', async () => {
    const verifier = { verify: vi.fn().mockRejectedValue(new UnauthorizedException()) };
    const resolver = { resolve: vi.fn() };
    const guard = new AuthGuard(verifier, resolver as never);
    const request = { header: vi.fn().mockReturnValue(undefined) };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(resolver.resolve).not.toHaveBeenCalled();
    expect(request).not.toHaveProperty('requestContext');
  });

  it('derives authority from the verified provider subject, ignoring client learner headers', async () => {
    const verifier = { verify: vi.fn().mockResolvedValue({ subject: 'user_verified' }) };
    const resolver = { resolve: vi.fn().mockResolvedValue('2f1083e8-1161-4d67-a499-df07cda43f31') };
    const guard = new AuthGuard(verifier, resolver as never);
    const request = {
      header: vi.fn((name: string) =>
        name === 'authorization'
          ? 'Bearer valid-token'
          : name === 'x-learner-id'
            ? 'attacker-controlled-id'
            : undefined,
      ),
    };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(resolver.resolve).toHaveBeenCalledWith('CLERK', 'user_verified');
    expect(request).toHaveProperty(
      'requestContext.learnerId',
      '2f1083e8-1161-4d67-a499-df07cda43f31',
    );
  });
});
