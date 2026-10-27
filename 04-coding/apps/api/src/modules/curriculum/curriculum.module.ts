import { Module } from '@nestjs/common';
import { GetPublishedLesson } from '../../application/curriculum/get-published-lesson.js';
import { CURRICULUM_REPOSITORY } from '../../application/curriculum/curriculum-repository.port.js';
import { AuthGuard } from '../../http/auth.guard.js';
import { PostgresCurriculumRepository } from '../../infrastructure/database/postgres-curriculum.repository.js';
import { IdentityModule } from '../identity/identity.module.js';
import { LessonsController } from './lessons.controller.js';
import { LessonExposureService } from './lesson-exposure.service.js';
import { ContentCatalogController } from './content-catalog.controller.js';
import { QuarantineController } from './quarantine.controller.js';
import { QuarantineService } from './quarantine.service.js';

@Module({
  imports: [IdentityModule],
  controllers: [LessonsController, QuarantineController, ContentCatalogController],
  providers: [
    GetPublishedLesson,
    LessonExposureService,
    QuarantineService,
    AuthGuard,
    { provide: CURRICULUM_REPOSITORY, useClass: PostgresCurriculumRepository },
  ],
})
export class CurriculumModule {}
