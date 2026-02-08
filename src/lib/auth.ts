import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // or "mysql", "postgresql", ...etc
  }),

  trustedOrigins: async request => {
    const origin = request?.headers.get('origin');

    const allowedOrigins = [
      process.env.APP_URL,
      process.env.BETTER_AUTH_URL,
      'http://localhost:3000',
      'http://localhost:4000',
      'http://localhost:5000',
      'https://skillbridge-frontend-plum.vercel.app',
      'https://skillbridge-backend-phi.vercel.app',
    ].filter(Boolean);

    // Check if origin matches allowed origins or Vercel pattern
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      return [origin];
    }

    return [];
  },
  basePath: '/api/auth',

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
      },
      status: {
        type: 'string',
        defaultValue: 'ACTIVE',
        required: false,
      },
    },
  },
  emailAndPassword: { enabled: true, autoSignIn: false },

  socialProviders: {
    google: {
      prompt: 'select_account consent',
      accessType: 'offline',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
