import { Request, Response } from 'express';
import { userService } from './user.service';
import { Role } from '../../../generated/prisma/enums';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { AppError } from '../../errors/AppError';

const updateMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthorized!');
  
  const userId = req.user.id as string;
  const result = await userService.updateMe(userId, req.body);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Updated User Profile',
    data: result,
  });
});

const getMyStats = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, 'Unauthorized!');
  
  const userId = req.user.id as string;
  const role = req.user.role as Role;
  const result = await userService.getMyStats(userId, role);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Retrieved Stats',
    data: result,
  });
});

export const userController = {
  updateMe,
  getMyStats,
};
