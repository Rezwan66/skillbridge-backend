import { Request, Response } from 'express';
import { bookingService } from './booking.service';
import { Role } from '../../../generated/prisma/enums';

const createBooking = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: 'Unauthorized!',
      });
    }
    const studentId = req.user.id;
    const { availabilityId } = req.body;
    const result = await bookingService.createBooking(
      studentId,
      availabilityId,
    );
    res.status(201).json({
      message: 'Booking created successfully',
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Availability Creation Failed';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

const getMyBookings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: 'Unauthorized!',
      });
    }
    const userId = req.user.id as string;
    const role = req.user.role as Role;
    const result = await bookingService.getMyBookings(userId, role);

    res.status(200).json({
      message: 'Retrieved all bookings successfully',
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Cannot get bookings';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: 'Unauthorized!',
      });
    }
    const bookingId = req.params.id as string;
    const userId = req.user.id as string;
    const role = req.user.role as Role;
    const result = await bookingService.getBookingById(bookingId, userId, role);

    res.status(200).json({
      message: 'Retrieved booking successfully',
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Cannot get booking';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: 'Unauthorized!',
      });
    }
    const bookingId = req.params.id as string;
    const userId = req.user.id as string;
    const role = req.user.role as Role;
    const result = await bookingService.updateBookingStatus(
      bookingId,
      userId,
      role,
    );

    res.status(200).json({
      message: 'Booking updated successfully',
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Cannot update booking';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

export const bookingController = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
};
