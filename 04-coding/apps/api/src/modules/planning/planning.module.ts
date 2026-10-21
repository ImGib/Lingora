import { Module } from '@nestjs/common';
import { AuthGuard } from '../../http/auth.guard.js';
import { IdentityModule } from '../identity/identity.module.js';
import { PlanningController } from './planning.controller.js';
import { PlanningService } from './planning.service.js';

@Module({ imports: [IdentityModule], controllers: [PlanningController], providers: [AuthGuard, PlanningService], exports: [PlanningService] })
export class PlanningModule {}
