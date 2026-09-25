import { Module } from '@nestjs/common';
import { EnvironmentModule } from './infrastructure/environment.module.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { IdentityModule } from './modules/identity/identity.module.js';
import { CurriculumModule } from './modules/curriculum/curriculum.module.js';

@Module({ imports: [EnvironmentModule, DatabaseModule, IdentityModule, CurriculumModule] })
export class AppModule {}
