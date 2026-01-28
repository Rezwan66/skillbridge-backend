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
    res.status(400).json({
      error: 'Cannot get users!',
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

export const adminController = { getAllUsers, updateUser };
