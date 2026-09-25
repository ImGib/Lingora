import { Module } from '@nestjs/common';
import { EnvironmentModule } from './infrastructure/environment.module.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { IdentityModule } from './modules/identity/identity.module.js';

@Module({ imports: [EnvironmentModule, DatabaseModule, IdentityModule] })
export class AppModule {}
