import express, { Router } from 'express';
import requireAuth from '../../middlewares/requireAuth';
import { Role } from '../../../generated/prisma/enums';
import { categoryController } from './category.controller';

const router = express.Router();

router.get('/', categoryController.getAllCategories);

router.post('/', requireAuth(Role.ADMIN), categoryController.createCategory);

export const categoryRouter: Router = router;
