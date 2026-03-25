import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '../../generated/prisma/client';
import { AppError } from '../errors/AppError';

type TErrorSources = {
  path: string | number;
  message: string;
}[];

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSource: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorSource = err.issues.map((issue) => ({
      path: String(issue.path[issue.path.length - 1] ?? ''),
      message: issue.message,
    }));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = 'Prisma Error';
    
    if (err.code === 'P2002') {
      message = 'Duplicate Entry';
      errorSource = [
        {
          path: '',
          message: `${err.meta?.target} already exists`,
        },
      ];
    } else {
      errorSource = [
        {
          path: '',
          message: err.message,
        },
      ];
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    errorSource = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    message = 'Prisma Initialization Error';
    errorSource = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSource = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSource = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err,
    stack: process.env.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
