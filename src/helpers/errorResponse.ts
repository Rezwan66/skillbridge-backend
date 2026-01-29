import { ErrorRequestHandler, Response } from 'express';

export const errorResponse = (error: ErrorRequestHandler, res: Response) => {
  const errorMessage =
    error instanceof Error ? error.message : 'Availability Creation Failed';
  res.status(400).json({
    error: errorMessage,
    details: error,
  });
};
