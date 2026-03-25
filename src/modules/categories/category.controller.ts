import { Request, Response } from 'express';
import { categoryService } from './category.service';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const result = await categoryService.createCategory(name);
  
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllCategories();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Retrieved all categories',
    data: result,
  });
});

const updateCategoryStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;
  const result = await categoryService.updateCategoryStatus(id as string, isActive);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Updated category status',
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getAllCategories,
  updateCategoryStatus,
};
