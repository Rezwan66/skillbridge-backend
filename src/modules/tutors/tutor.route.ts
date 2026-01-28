import express, { Router } from 'express';
import { tutorController } from './tutor.controller';
import requireAuth from '../../middlewares/requireAuth';
import { Role } from '../../../generated/prisma/enums';

const router = express.Router();

router.put('/profile', requireAuth(Role.TUTOR), tutorController.createProfile);
router.put(
  '/availability',
  requireAuth(Role.TUTOR),
  tutorController.updateAvailability,
);

export const tutorRouter: Router = router;
