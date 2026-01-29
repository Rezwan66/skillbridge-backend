import express, { Router } from 'express';
import requireAuth from '../../middlewares/requireAuth';
import { bookingController } from './booking.controller';
import { Role } from '../../../generated/prisma/enums';

const router = express.Router();

// get all role-based bookings
router.get('/', requireAuth(), bookingController.getMyBookings);

// get role-based booking details
router.get('/:id', requireAuth(), bookingController.getBookingById);

// create booking - student only
router.post('/', requireAuth(Role.STUDENT), bookingController.createBooking);

// update booking status - TUTOR/STUDENT
router.patch(
  '/:id',
  requireAuth(Role.STUDENT, Role.TUTOR),
  bookingController.updateBookingStatus,
);

export const bookingRouter: Router = router;
