import { Global, Module } from '@nestjs/common';
import { loadEnvironment } from '../config/environment.js';

export const ENVIRONMENT = Symbol('ENVIRONMENT');

@Global()
@Module({
  providers: [{ provide: ENVIRONMENT, useFactory: loadEnvironment }],
  exports: [ENVIRONMENT],
})
export class EnvironmentModule {}
