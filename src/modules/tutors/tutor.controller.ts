import { Request, Response } from 'express';
import { tutorService } from './tutor.service';

const createProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: 'Unauthorized!',
      });
    }
    const result = await tutorService.createProfile(
      req.user.id as string,
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

export const tutorController = {
  createProfile,
  createAvailability,
  updateAvailability,
};
