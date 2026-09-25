import { Module } from '@nestjs/common';
import { AuthGuard } from '../../http/auth.guard.js';
import { IdentityModule } from '../identity/identity.module.js';
import { AttemptsController } from './attempts.controller.js';
import { AttemptsService } from './attempts.service.js';
import { PlanningModule } from '../planning/planning.module.js';
import { SessionsController } from './sessions.controller.js';
import { SessionsService } from './sessions.service.js';

@Module({ imports: [IdentityModule, PlanningModule], controllers: [AttemptsController, SessionsController], providers: [AuthGuard, AttemptsService, SessionsService] })
export class LearningModule {}
