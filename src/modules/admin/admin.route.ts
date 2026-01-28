import express, { Router } from 'express';
import { adminController } from './admin.controller';
import requireAuth from '../../middlewares/requireAuth';
import { Role } from '../../../generated/prisma/enums';

const router = express.Router();

router.get('/users', requireAuth(Role.ADMIN), adminController.getAllUsers);

router.patch('/users/:id', requireAuth(Role.ADMIN), adminController.updateUser);

export const adminRouter: Router = router;
