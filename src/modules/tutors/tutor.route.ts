import express, { Router } from 'express';
import { tutorController } from './tutor.controller';
import requireAuth from '../../middlewares/requireAuth';
import { Role } from '../../../generated/prisma/enums';

const router = express.Router();

router.put('/profile', requireAuth(Role.TUTOR), tutorController.createProfile);
router.post(
  '/availability',
  requireAuth(Role.TUTOR),
  tutorController.createAvailability,
);
router.put(
  '/availability/:id',
  requireAuth(Role.TUTOR),
  tutorController.updateAvailability,
);
router.put('/categories', requireAuth(), tutorController.updateTutorCategories);

export const tutorRouter: Router = router;
