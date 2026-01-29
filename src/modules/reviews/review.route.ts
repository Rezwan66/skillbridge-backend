import express, { Router } from 'express';
import requireAuth from '../../middlewares/requireAuth';
import { Role } from '../../../generated/prisma/enums';
import { reviewController } from './review.controller';

const router = express.Router();

router.post('/', requireAuth(Role.STUDENT), reviewController.createReview);

export const reviewRouter: Router = router;
