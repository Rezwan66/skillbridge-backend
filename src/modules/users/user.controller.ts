import { Request, Response } from 'express';
import { userService } from './user.service';

const updateMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: 'Unauthorized!',
      });
    }
    const userId = req.user.id as string;

    const result = await userService.updateMe(userId, req.body);
    res.status(200).json({
      message: `Updated User Profile`,
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Profile update failed';
    res.status(400).json({
      error: errorMessage,
      details: error,
    });
  }
};

export const userController = {
  updateMe,
};
