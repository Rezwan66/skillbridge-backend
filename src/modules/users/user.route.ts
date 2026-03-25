import express, { Router } from 'express';
import requireAuth from '../../middlewares/requireAuth';
import { userController } from './user.controller';
import { userValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.get('/stats', requireAuth(), userController.getMyStats);

// update profile
router.patch('/me', requireAuth(), validateRequest(userValidation.updateMeValidationSchema), userController.updateMe);

export const userRouter: Router = router;
