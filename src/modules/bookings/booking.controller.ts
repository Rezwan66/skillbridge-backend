import { Request, Response } from 'express';
import { bookingService } from './booking.service';
import { Role } from '../../../generated/prisma/enums';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { AppError } from '../../errors/AppError';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthorized!');
  
  const studentId = req.user.id;
  const { availabilityId } = req.body;
  const result = await bookingService.createBooking(studentId, availabilityId);
  
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Booking created successfully',
    data: result,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthorized!');
  
  const userId = req.user.id as string;
  const role = req.user.role as Role;
  const result = await bookingService.getMyBookings(userId, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Retrieved all bookings successfully',
    data: result,
  });
});

const getBookingById = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthorized!');
  
  const bookingId = req.params.id as string;
  const userId = req.user.id as string;
  const role = req.user.role as Role;
  const result = await bookingService.getBookingById(bookingId, userId, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Retrieved booking successfully',
    data: result,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthorized!');
  
  const bookingId = req.params.id as string;
  const userId = req.user.id as string;
  const role = req.user.role as Role;
  const result = await bookingService.updateBookingStatus(bookingId, userId, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking updated successfully',
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
};
