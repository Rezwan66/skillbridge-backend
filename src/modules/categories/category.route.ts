import express, { Router } from 'express';
import requireAuth from '../../middlewares/requireAuth';
import { Role } from '../../../generated/prisma/enums';
import { categoryController } from './category.controller';

const router = express.Router();

// Public - get all categories where isActive:true
router.get('/', categoryController.getAllCategories);

// Admin only - create categories
router.post('/', requireAuth(Role.ADMIN), categoryController.createCategory);

// Admin only - update category status
router.patch(
  '/:id/status',
  requireAuth(Role.ADMIN),
  categoryController.updateCategoryStatus,
);

export const categoryRouter: Router = router;
