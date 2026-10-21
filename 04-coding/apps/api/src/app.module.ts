import { Module } from '@nestjs/common';
import { EnvironmentModule } from './infrastructure/environment.module.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { IdentityModule } from './modules/identity/identity.module.js';
import { CurriculumModule } from './modules/curriculum/curriculum.module.js';
import { LearningModule } from './modules/learning/learning.module.js';
import { PlanningModule } from './modules/planning/planning.module.js';
import { PlacementModule } from './modules/placement/placement.module.js';

@Module({ imports: [EnvironmentModule, DatabaseModule, IdentityModule, CurriculumModule, LearningModule, PlanningModule, PlacementModule] })
export class AppModule {}
