import { Request, Response } from 'express';
import { reviewService } from './review.service';
import { UserStatus } from '../../../generated/prisma/enums';

const createReview = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: 'Unauthorized!',
      });
    }

    if (req.user.status === UserStatus.BANNED) {
      return res.status(400).json({
        error: 'Unauthorized: you are banned from writing reviews',
      });
    }

    const result = await reviewService.createReview(
      req.user.id as string,
      req.body,
    );

    res.status(201).json({
      message: 'Review submitted successfully',
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to submit review';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

const getAllReviews = async (req: Request, res: Response) => {
  try {
    const result = await reviewService.getAllReviews();

    res.status(200).json({
      message: 'Reviews retrieved successfully',
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to retrieve reviews';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

export const reviewController = {
  createReview,
  getAllReviews,
};
