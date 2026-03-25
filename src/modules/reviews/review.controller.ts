import { Request, Response } from 'express';
import { reviewService } from './review.service';
import { UserStatus } from '../../../generated/prisma/enums';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { AppError } from '../../errors/AppError';

const createReview = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthorized!');

  if (req.user.status === UserStatus.BANNED) {
    throw new AppError(403, 'Unauthorized: you are banned from writing reviews');
  }

  const result = await reviewService.createReview(req.user.id as string, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Review submitted successfully',
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.getAllReviews();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

export const reviewController = {
  createReview,
  getAllReviews,
};
