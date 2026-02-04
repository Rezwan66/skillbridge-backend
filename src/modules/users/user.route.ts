import express, { Router } from 'express';
import requireAuth from '../../middlewares/requireAuth';
import { userController } from './user.controller';

const router = express.Router();

router.get('/stats', requireAuth(), userController.getMyStats);

// update profile
router.patch('/me', requireAuth(), userController.updateMe);

export const userRouter: Router = router;
