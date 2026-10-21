import { Module } from '@nestjs/common';
import { AuthGuard } from '../../http/auth.guard.js';
import { IdentityModule } from '../identity/identity.module.js';
import { AttemptsController } from './attempts.controller.js';
import { AttemptsService } from './attempts.service.js';
import { PlanningModule } from '../planning/planning.module.js';
import { SessionsController } from './sessions.controller.js';
import { SessionsService } from './sessions.service.js';
import { ArtifactsController } from './artifacts.controller.js';
import { ArtifactsService } from './artifacts.service.js';
import { STORAGE_PORT } from '../../application/storage/storage.port.js';
import { LocalStorageService } from '../../infrastructure/storage/local-storage.service.js';

@Module({
  imports: [IdentityModule, PlanningModule],
  controllers: [AttemptsController, SessionsController, ArtifactsController],
  providers: [
    AuthGuard,
    AttemptsService,
    SessionsService,
    ArtifactsService,
    { provide: STORAGE_PORT, useClass: LocalStorageService },
  ],
})
export class LearningModule {}

