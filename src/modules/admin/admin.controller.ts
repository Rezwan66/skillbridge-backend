import { Request, Response } from 'express';
import { adminService } from './admin.service';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllUsers();
    // console.log(result);

    res.status(200).json({
      message: 'Retrieved all users successfully',
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Cannot get users';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};
const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await adminService.updateUser(id as string, req.body);
    // console.log(result);

    res.status(200).json({
      message: 'Updated user status',
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'User status update failed';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};
const updateTutorFeaturedStatus = async (req: Request, res: Response) => {
  try {
    const tutorProfileId = req.params.id;
    const { isFeatured } = req.body;

    const result = await adminService.updateTutorFeaturedStatus(
      tutorProfileId as string,
      isFeatured,
    );

    res.status(200).json({
      message: 'Updated tutor featured status',
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Tutor featured status update failed';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

export const adminController = {
  getAllUsers,
  updateUser,
  updateTutorFeaturedStatus,
};
