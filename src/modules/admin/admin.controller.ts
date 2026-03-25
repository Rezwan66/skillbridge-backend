import { Request, Response } from 'express';
import { adminService } from './admin.service';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllUsers();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Retrieved all users successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.updateUser(id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Updated user status',
    data: result,
  });
});

const updateTutorFeaturedStatus = catchAsync(async (req: Request, res: Response) => {
  const tutorProfileId = req.params.id;
  const { isFeatured } = req.body;

  const result = await adminService.updateTutorFeaturedStatus(tutorProfileId as string, isFeatured);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Updated tutor featured status',
    data: result,
  });
});

export const adminController = {
  getAllUsers,
  updateUser,
  updateTutorFeaturedStatus,
};
