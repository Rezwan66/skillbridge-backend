import { Request, Response } from 'express';
import { tutorService } from './tutor.service';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { AppError } from '../../errors/AppError';

interface SearchQueryType {
  search: string | undefined;
  categoryId: string | undefined;
  minRating: number | undefined;
  maxPrice: number | undefined;
  isFeatured: boolean;
}

const createProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthorized!');
  
  const { id } = req.user;
  const result = await tutorService.createProfile(id as string, req.body);
  
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: `${result.created ? 'Created' : 'Updated'} Tutor Profile`,
    data: result.result,
  });
});

const createAvailability = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthorized!');
  
  const result = await tutorService.createAvailability(req.user.id as string, req.body);
  
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Created Tutor Availability',
    data: result,
  });
});

const updateAvailability = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthorized!');
  
  const result = await tutorService.updateAvailability(
    req.params.id as string,
    req.user.id as string,
    req.body
  );
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Updated Tutor Availability',
    data: result,
  });
});

const updateTutorCategories = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthorized!');
  
  const userId = req.user.id;
  const { categoryIds } = req.body;
  const result = await tutorService.updateTutorCategories(userId, categoryIds);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Updated Tutor Categories',
    data: result,
  });
});

const getAllTutors = catchAsync(async (req: Request, res: Response) => {
  const result = await tutorService.getAllTutors(req.query as unknown as SearchQueryType);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Retrieved tutors successfully',
    data: result,
  });
});

const getTutorById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await tutorService.getTutorById(id as string);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Retrieved tutor successfully',
    data: result,
  });
});

const getMyTutorProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthorized!');
  
  const result = await tutorService.getMyTutorProfile(req.user.id);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Retrieved tutor successfully',
    data: result,
  });
});

export const tutorController = {
  createProfile,
  createAvailability,
  updateAvailability,
  updateTutorCategories,
  getAllTutors,
  getTutorById,
  getMyTutorProfile,
};
