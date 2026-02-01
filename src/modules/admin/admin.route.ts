import express, { Router } from 'express';
import { adminController } from './admin.controller';
import requireAuth from '../../middlewares/requireAuth';
import { Role } from '../../../generated/prisma/enums';

const router = express.Router();

// Admin only - get all users
router.get('/users', requireAuth(Role.ADMIN), adminController.getAllUsers);

// Admin only - ban/active users
router.patch('/users/:id', requireAuth(Role.ADMIN), adminController.updateUser);

// Admin only - feature tutors
router.patch(
  '/tutors/:id/isfeatured',
  requireAuth(Role.ADMIN),
  adminController.updateTutorFeaturedStatus,
);

export const adminRouter: Router = router;
