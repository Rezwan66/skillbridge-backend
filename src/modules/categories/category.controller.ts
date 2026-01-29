import { Request, Response } from 'express';
import { categoryService } from './category.service';

const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const result = await categoryService.createCategory(name);
    res.status(201).json({
      message: 'Category created successfully',
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

const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const result = await categoryService.getAllCategories();

    res.status(200).json({
      message: 'Retrieved all categories',
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

export const categoryController = {
  createCategory,
  getAllCategories,
};
