import express, { Router } from 'express';
import requireAuth from '../../middlewares/requireAuth';
import { bookingController } from './booking.controller';
import { Role } from '../../../generated/prisma/enums';

const router = express.Router();

router.get('/', requireAuth(), bookingController.getMyBookings);

router.get('/:id', requireAuth(), bookingController.getBookingById);

router.post('/', requireAuth(Role.STUDENT), bookingController.createBooking);

router.patch(
  '/:id',
  requireAuth(Role.STUDENT, Role.TUTOR),
  bookingController.updateBookingStatus,
);

export const bookingRouter: Router = router;
