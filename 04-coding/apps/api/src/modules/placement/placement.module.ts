import { Module } from '@nestjs/common';
import { AuthGuard } from '../../http/auth.guard.js';
import { IdentityModule } from '../identity/identity.module.js';
import { PlacementController } from './placement.controller.js';
import { PlacementService } from './placement.service.js';

@Module({ imports: [IdentityModule], controllers: [PlacementController], providers: [AuthGuard, PlacementService] })
export class PlacementModule {}
