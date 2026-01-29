import express, { Router } from 'express';
import { tutorController } from './tutor.controller';
import requireAuth from '../../middlewares/requireAuth';
import { Role } from '../../../generated/prisma/enums';

const router = express.Router();

//* Get Tutors - filter enabled - public
router.get('/', tutorController.getAllTutors);

router.get('/:id', tutorController.getTutorById);

// create profile
router.put('/profile', requireAuth(Role.TUTOR), tutorController.createProfile);
// create availability
router.post(
  '/availability',
  requireAuth(Role.TUTOR),
  tutorController.createAvailability,
);
// update availability
router.put(
  '/availability/:id',
  requireAuth(Role.TUTOR),
  tutorController.updateAvailability,
);
// update tutorCategories
router.put('/categories', requireAuth(), tutorController.updateTutorCategories);

export const tutorRouter: Router = router;
