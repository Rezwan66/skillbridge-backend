import { Request, Response } from 'express';
import { tutorService } from './tutor.service';

interface SearchQueryType {
  search: string | undefined;
  categoryId: string | undefined;
  minRating: number | undefined;
  maxPrice: number | undefined;
  isFeatured: boolean;
}

const createProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: 'Unauthorized!',
      });
    }
    const { id, name } = req.user;
    const result = await tutorService.createProfile(
      id as string,
      name as string,
      req.body,
    );
    res.status(201).json({
      message: `${result.created ? 'Created' : 'Updated'} Tutor Profile`,
      data: result.result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Profile creation or update failed';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

const createAvailability = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: 'Unauthorized!',
      });
    }
    const result = await tutorService.createAvailability(
      req.user.id as string,
      req.body,
    );
    res.status(201).json({
      message: 'Created Tutor Availability',
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

const updateAvailability = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: 'Unauthorized!',
      });
    }
    const result = await tutorService.updateAvailability(
      req.params.id as string,
      req.user.id as string,
      req.body,
    );
    res.status(200).json({
      message: 'Updated Tutor Availability',
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Availability Update Failed';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

const updateTutorCategories = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: 'Unauthorized!',
      });
    }
    const userId = req.user.id;
    const { categoryIds } = req.body;
    const result = await tutorService.updateTutorCategories(
      userId,
      categoryIds,
    );
    res.status(200).json({
      message: 'Updated Tutor Categories',
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Category Update Failed';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

const getAllTutors = async (req: Request, res: Response) => {
  try {
    const result = await tutorService.getAllTutors(
      req.query as unknown as SearchQueryType,
    );
    res.status(200).json({
      message: 'Retrieved tutors successfully',
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Tutors retrieval failed';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

const getTutorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await tutorService.getTutorById(id as string);
    res.status(200).json({
      message: 'Retrieved tutor successfully',
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Tutor retrieval failed';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

export const tutorController = {
  createProfile,
  createAvailability,
  updateAvailability,
  updateTutorCategories,
  getAllTutors,
  getTutorById,
};
