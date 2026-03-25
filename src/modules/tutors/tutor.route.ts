import express, { Router } from 'express';
import { tutorController } from './tutor.controller';
import requireAuth from '../../middlewares/requireAuth';
import validateRequest from '../../middlewares/validateRequest';
import { tutorValidation } from './tutor.validation';
import { Role } from '../../../generated/prisma/enums';

const router = express.Router();

//* Get Tutors - filter enabled - public
router.get('/', tutorController.getAllTutors);

router.get(
  '/my-profile',
  requireAuth(Role.TUTOR),
  tutorController.getMyTutorProfile,
);

router.get('/:id', tutorController.getTutorById);

// create profile
router.put('/profile', requireAuth(Role.TUTOR), validateRequest(tutorValidation.createProfileValidationSchema), tutorController.createProfile);
// create availability
router.post(
  '/availability',
  requireAuth(Role.TUTOR),
  validateRequest(tutorValidation.availabilityValidationSchema),
  tutorController.createAvailability,
);
// update availability
router.put(
  '/availability/:id',
  requireAuth(Role.TUTOR),
  validateRequest(tutorValidation.availabilityValidationSchema),
  tutorController.updateAvailability,
);
// update tutorCategories
router.put('/categories', requireAuth(), validateRequest(tutorValidation.updateCategoriesValidationSchema), tutorController.updateTutorCategories);

export const tutorRouter: Router = router;
