import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!, 'http://localhost:4000'],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  advanced: {
    cookiePrefix: 'better-auth',
    useSecureCookies: process.env.NODE_ENV === 'production',

    defaultCookieAttributes: {
      sameSite: 'lax', // local: 'lax', prod: 'none'
      secure: false, // local: false, prod: true
      httpOnly: false, // local: false, prod: true
    },

    crossSubDomainCookies: { enabled: false },
    disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)
  },

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
