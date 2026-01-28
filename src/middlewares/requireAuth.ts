import { NextFunction, Request, Response } from 'express';
import { auth } from '../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { Role } from '../../generated/prisma/enums';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        status: string;
      };
    }
  }
}

const requireAuth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      console.log('from requireAuth-->', session?.user);

      if (!session) {
        return res.status(401).json({
          success: false,
          message: 'You are not authorized!',
        });
      }

      if (roles.length && !roles.includes(session.user.role as Role)) {
        return res.status(403).json({
          success: false,
          message:
            'Forbidden! You don`t have permission to access this resource.',
        });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        status: session.user.status as string,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default requireAuth;
