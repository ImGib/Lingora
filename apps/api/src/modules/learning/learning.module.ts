import { Module } from '@nestjs/common';
import { AuthGuard } from '../../http/auth.guard.js';
import { IdentityModule } from '../identity/identity.module.js';
import { AttemptsController } from './attempts.controller.js';
import { AttemptsService } from './attempts.service.js';
import { PlanningModule } from '../planning/planning.module.js';

@Module({ imports: [IdentityModule, PlanningModule], controllers: [AttemptsController], providers: [AuthGuard, AttemptsService] })
export class LearningModule {}
