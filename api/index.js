var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express7 from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String        @id\n  name          String\n  email         String\n  emailVerified Boolean       @default(false)\n  image         String?\n  createdAt     DateTime      @default(now())\n  updatedAt     DateTime      @updatedAt\n  role          String\n  status        String?       @default("ACTIVE")\n  sessions      Session[]\n  accounts      Account[]\n  tutorProfile  TutorProfile?\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Availability {\n  id             String   @id @default(uuid())\n  tutorProfileId String\n  startTime      DateTime\n  endTime        DateTime\n  isBooked       Boolean  @default(false)\n\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  booking      Booking?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Booking {\n  id             String        @id @default(uuid())\n  studentId      String //* better-auth\n  tutorProfileId String\n  availabilityId String        @unique\n  status         BookingStatus @default(CONFIRMED)\n  paymentStatus  PaymentStatus @default(UNPAID)\n\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  availability Availability @relation(fields: [availabilityId], references: [id])\n  review       Review?\n  payment      Payment?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Category {\n  id              String          @id @default(uuid())\n  name            String          @db.VarChar(225)\n  isActive        Boolean         @default(true)\n  createdAt       DateTime        @default(now())\n  updatedAt       DateTime        @updatedAt\n  tutorCategories TutorCategory[]\n}\n\nmodel TutorCategory {\n  id             String @id @default(uuid())\n  tutorProfileId String\n  categoryId     String\n\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  category     Category     @relation(fields: [categoryId], references: [id])\n}\n\nenum Role {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum BookingStatus {\n  CONFIRMED\n  CANCELLED\n  COMPLETED\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nenum PaymentStatus {\n  UNPAID\n  PAID\n  FAILED\n}\n\nmodel Payment {\n  id                 String        @id @default(uuid())\n  amount             Float\n  transactionId      String        @unique @db.Uuid()\n  stripeEventId      String?       @unique\n  status             PaymentStatus @default(UNPAID)\n  paymentGatewayData Json?\n  createdAt          DateTime      @default(now())\n  updatedAt          DateTime      @updatedAt\n\n  bookingId String  @unique\n  booking   Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  @@index([bookingId])\n  @@index([transactionId])\n  @@map("payments")\n}\n\nmodel Review {\n  id             String @id @default(uuid())\n  bookingId      String @unique\n  studentId      String //* better-auth\n  tutorProfileId String\n\n  rating  Int\n  comment String? @db.Text\n\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  booking      Booking      @relation(fields: [bookingId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel TutorProfile {\n  id              String   @id @default(uuid())\n  userId          String   @unique //* better-auth\n  bio             String?  @db.VarChar(255)\n  name            String?\n  hourlyRate      Decimal?\n  experienceYears Int?\n  ratingAvg       Decimal?\n  totalReviews    Int?\n  isFeatured      Boolean? @default(false)\n\n  tutorCategories TutorCategory[]\n  availabilities  Availability[]\n  bookings        Booking[]\n  reviews         Review[]\n  user            User            @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"},{"name":"booking","kind":"object","type":"Booking","relationName":"AvailabilityToBooking"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"availabilityId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToBooking"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"payment","kind":"object","type":"Payment","relationName":"BookingToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"tutorCategories","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"}],"dbName":null},"TutorCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"}],"dbName":"payments"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Decimal"},{"name":"experienceYears","kind":"scalar","type":"Int"},{"name":"ratingAvg","kind":"scalar","type":"Decimal"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"tutorCategories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"availabilities","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AvailabilityScalarFieldEnum: () => AvailabilityScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorCategoryScalarFieldEnum: () => TutorCategoryScalarFieldEnum,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Availability: "Availability",
  Booking: "Booking",
  Category: "Category",
  TutorCategory: "TutorCategory",
  Payment: "Payment",
  Review: "Review",
  TutorProfile: "TutorProfile"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AvailabilityScalarFieldEnum = {
  id: "id",
  tutorProfileId: "tutorProfileId",
  startTime: "startTime",
  endTime: "endTime",
  isBooked: "isBooked",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BookingScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorProfileId: "tutorProfileId",
  availabilityId: "availabilityId",
  status: "status",
  paymentStatus: "paymentStatus",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorCategoryScalarFieldEnum = {
  id: "id",
  tutorProfileId: "tutorProfileId",
  categoryId: "categoryId"
};
var PaymentScalarFieldEnum = {
  id: "id",
  amount: "amount",
  transactionId: "transactionId",
  stripeEventId: "stripeEventId",
  status: "status",
  paymentGatewayData: "paymentGatewayData",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  bookingId: "bookingId"
};
var ReviewScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  studentId: "studentId",
  tutorProfileId: "tutorProfileId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  bio: "bio",
  name: "name",
  hourlyRate: "hourlyRate",
  experienceYears: "experienceYears",
  ratingAvg: "ratingAvg",
  totalReviews: "totalReviews",
  isFeatured: "isFeatured",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  STUDENT: "STUDENT",
  TUTOR: "TUTOR",
  ADMIN: "ADMIN"
};
var BookingStatus = {
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BANNED: "BANNED"
};
var PaymentStatus = {
  UNPAID: "UNPAID",
  PAID: "PAID",
  FAILED: "FAILED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  baseURL: process.env.APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:5000",
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");
    const allowedOrigins2 = [
      process.env.APP_URL,
      process.env.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:4000",
      "http://localhost:5000",
      "https://skillbridge-frontend-plum.vercel.app",
      "https://skillbridge-backend-phi.vercel.app"
    ].filter(Boolean);
    if (!origin || allowedOrigins2.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return [origin];
    }
    return [];
  },
  basePath: "/api/auth",
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production"
    },
    crossSubDomainCookies: {
      enabled: true
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: { enabled: true, autoSignIn: false },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/middlewares/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route Not Found",
    path: req.originalUrl,
    date: Date()
  });
}

// src/middlewares/globalErrorHandler.ts
import { ZodError } from "zod";

// src/errors/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSource = [
    {
      path: "",
      message: "Something went wrong"
    }
  ];
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorSource = err.issues.map((issue) => ({
      path: String(issue.path[issue.path.length - 1] ?? ""),
      message: issue.message
    }));
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = "Prisma Error";
    if (err.code === "P2002") {
      message = "Duplicate Entry";
      errorSource = [
        {
          path: "",
          message: `${err.meta?.target} already exists`
        }
      ];
    } else {
      errorSource = [
        {
          path: "",
          message: err.message
        }
      ];
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    message = "Validation Error";
    errorSource = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Prisma Initialization Error";
    errorSource = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSource = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSource = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err,
    stack: process.env.NODE_ENV === "development" ? err?.stack : null
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/modules/tutors/tutor.route.ts
import express from "express";

// src/modules/tutors/tutor.service.ts
var createProfile = async (id, data) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId: id
    }
  });
  const ratingAggResult = await prisma.review.aggregate({
    _avg: { rating: true },
    where: { tutorProfileId: id }
  });
  const totalReviews = await prisma.review.count({
    where: { tutorProfileId: id }
  });
  if (tutorProfile) {
    const result2 = await prisma.tutorProfile.update({
      where: { id: tutorProfile.id },
      data: {
        ...tutorProfile,
        ...data,
        // name,
        ratingAvg: ratingAggResult._avg.rating,
        totalReviews,
        isFeatured: false
      }
    });
    return { result: result2, created: false };
  }
  const result = await prisma.tutorProfile.create({
    data: {
      ...data,
      userId: id,
      // name,
      ratingAvg: ratingAggResult._avg.rating,
      totalReviews,
      isFeatured: false
    }
  });
  return { result, created: true };
};
var createAvailability = async (id, { startTime, endTime }) => {
  if (startTime >= endTime) {
    throw new Error("Invalid input date range. Please check again.");
  }
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId: id
    }
  });
  if (!tutorProfile) {
    throw new Error(
      "You do not have a tutor profile. Create a tutor profile first to set availability."
    );
  }
  const result = await prisma.availability.create({
    data: {
      tutorProfileId: tutorProfile?.id,
      startTime,
      endTime
    }
  });
  return result;
};
var updateAvailability = async (id, tutorId, { startTime, endTime }) => {
  if (startTime >= endTime) {
    throw new Error("Invalid input date range. Please check again.");
  }
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId: tutorId
    }
  });
  if (!tutorProfile) {
    throw new Error("Tutor profile not found.");
  }
  const availability = await prisma.availability.findUnique({
    where: { id }
  });
  if (!availability || availability.tutorProfileId !== tutorProfile.id) {
    throw new Error("Unauthorized or availability not found.");
  }
  if (availability.isBooked) {
    throw new Error("Cannot update a booked slot.");
  }
  const result = await prisma.availability.update({
    where: {
      id
    },
    data: {
      startTime,
      endTime
    }
  });
  return result;
};
var updateTutorCategories = async (userId, categoryIds) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId
    }
  });
  if (!tutorProfile) {
    throw new Error("Tutor profile not found.");
  }
  const validCategories = await prisma.category.findMany({
    where: {
      id: { in: categoryIds },
      isActive: true
    }
  });
  if (validCategories.length !== categoryIds.length) {
    throw new Error("One or more categories are invalid");
  }
  await prisma.tutorCategory.deleteMany({
    where: { tutorProfileId: tutorProfile.id }
  });
  return await prisma.tutorCategory.createMany({
    data: categoryIds.map((categoryId) => ({
      tutorProfileId: tutorProfile.id,
      categoryId
    }))
  });
};
var getAllTutors = async ({
  search,
  categoryId,
  minRating,
  maxPrice,
  isFeatured
}) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          bio: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          tutorCategories: {
            some: {
              category: {
                name: {
                  contains: search,
                  mode: "insensitive"
                }
              }
            }
          }
        }
      ]
    });
  }
  if (minRating) {
    andConditions.push({
      ratingAvg: {
        gte: Number(minRating)
      }
    });
  }
  if (maxPrice) {
    andConditions.push({
      hourlyRate: {
        lte: Number(maxPrice)
      }
    });
  }
  if (isFeatured !== void 0) {
    andConditions.push({
      isFeatured: Boolean(isFeatured)
    });
  }
  if (categoryId) {
    andConditions.push({
      tutorCategories: {
        some: { categoryId }
      }
    });
  }
  const allTutors = await prisma.tutorProfile.findMany({
    where: { AND: andConditions },
    include: {
      tutorCategories: { include: { category: true } },
      availabilities: true,
      bookings: true,
      reviews: true
    }
  });
  return allTutors;
};
var getTutorById = async (id) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      reviews: true,
      tutorCategories: {
        include: { category: { select: { name: true } } }
      },
      availabilities: true
    }
  });
  if (!tutor) {
    throw new Error("Tutor not found");
  }
  return tutor;
};
var getMyTutorProfile = async (userId) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      reviews: true,
      tutorCategories: {
        include: { category: { select: { name: true } } }
      },
      availabilities: true
    }
  });
  console.log(tutor);
  return tutor;
};
var tutorService = {
  createProfile,
  createAvailability,
  updateAvailability,
  updateTutorCategories,
  getAllTutors,
  getTutorById,
  getMyTutorProfile
};

// src/helpers/catchAsync.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
var catchAsync_default = catchAsync;

// src/helpers/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data
  });
};
var sendResponse_default = sendResponse;

// src/modules/tutors/tutor.controller.ts
var createProfile2 = catchAsync_default(async (req, res) => {
  if (!req.user) throw new AppError(401, "Unauthorized!");
  const { id } = req.user;
  const result = await tutorService.createProfile(id, req.body);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: `${result.created ? "Created" : "Updated"} Tutor Profile`,
    data: result.result
  });
});
var createAvailability2 = catchAsync_default(async (req, res) => {
  if (!req.user) throw new AppError(401, "Unauthorized!");
  const result = await tutorService.createAvailability(req.user.id, req.body);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Created Tutor Availability",
    data: result
  });
});
var updateAvailability2 = catchAsync_default(async (req, res) => {
  if (!req.user) throw new AppError(401, "Unauthorized!");
  const result = await tutorService.updateAvailability(
    req.params.id,
    req.user.id,
    req.body
  );
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Updated Tutor Availability",
    data: result
  });
});
var updateTutorCategories2 = catchAsync_default(async (req, res) => {
  if (!req.user) throw new AppError(401, "Unauthorized!");
  const userId = req.user.id;
  const { categoryIds } = req.body;
  const result = await tutorService.updateTutorCategories(userId, categoryIds);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Updated Tutor Categories",
    data: result
  });
});
var getAllTutors2 = catchAsync_default(async (req, res) => {
  const result = await tutorService.getAllTutors(req.query);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Retrieved tutors successfully",
    data: result
  });
});
var getTutorById2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await tutorService.getTutorById(id);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Retrieved tutor successfully",
    data: result
  });
});
var getMyTutorProfile2 = catchAsync_default(async (req, res) => {
  if (!req.user) throw new AppError(401, "Unauthorized!");
  const result = await tutorService.getMyTutorProfile(req.user.id);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Retrieved tutor successfully",
    data: result
  });
});
var tutorController = {
  createProfile: createProfile2,
  createAvailability: createAvailability2,
  updateAvailability: updateAvailability2,
  updateTutorCategories: updateTutorCategories2,
  getAllTutors: getAllTutors2,
  getTutorById: getTutorById2,
  getMyTutorProfile: getMyTutorProfile2
};

// src/middlewares/requireAuth.ts
import { fromNodeHeaders } from "better-auth/node";
var requireAuth = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
      });
      if (!session) {
        throw new AppError(401, "You are not authorized!");
      }
      if (roles.length && !roles.includes(session.user.role)) {
        throw new AppError(403, "Forbidden! You don`t have permission to access this resource.");
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        status: session.user.status
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};
var requireAuth_default = requireAuth;

// src/middlewares/validateRequest.ts
var validateRequest = (schema) => {
  return catchAsync_default(async (req, res, next) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      cookies: req.cookies
    });
    next();
  });
};
var validateRequest_default = validateRequest;

// src/modules/tutors/tutor.validation.ts
import { z } from "zod";
var createProfileValidationSchema = z.object({
  body: z.object({
    bio: z.string().min(1, "Bio is required").optional(),
    name: z.string().min(1, "Name is required").optional(),
    hourlyRate: z.number().positive().optional()
    // any other dynamic fields omit their exact checking for flexibility unless specified
  }).passthrough()
});
var availabilityValidationSchema = z.object({
  body: z.object({
    startTime: z.string().datetime({ message: "Invalid ISO datetime string" }),
    endTime: z.string().datetime({ message: "Invalid ISO datetime string" })
  }).refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: "endTime must be after startTime",
    path: ["endTime"]
  })
});
var updateCategoriesValidationSchema = z.object({
  body: z.object({
    categoryIds: z.array(z.string().uuid())
  })
});
var tutorValidation = {
  createProfileValidationSchema,
  availabilityValidationSchema,
  updateCategoriesValidationSchema
};

// src/modules/tutors/tutor.route.ts
var router = express.Router();
router.get("/", tutorController.getAllTutors);
router.get(
  "/my-profile",
  requireAuth_default(Role.TUTOR),
  tutorController.getMyTutorProfile
);
router.get("/:id", tutorController.getTutorById);
router.put("/profile", requireAuth_default(Role.TUTOR), validateRequest_default(tutorValidation.createProfileValidationSchema), tutorController.createProfile);
router.post(
  "/availability",
  requireAuth_default(Role.TUTOR),
  validateRequest_default(tutorValidation.availabilityValidationSchema),
  tutorController.createAvailability
);
router.put(
  "/availability/:id",
  requireAuth_default(Role.TUTOR),
  validateRequest_default(tutorValidation.availabilityValidationSchema),
  tutorController.updateAvailability
);
router.put("/categories", requireAuth_default(), validateRequest_default(tutorValidation.updateCategoriesValidationSchema), tutorController.updateTutorCategories);
var tutorRouter = router;

// src/modules/categories/category.route.ts
import express2 from "express";

// src/modules/categories/category.service.ts
var createCategory = async (name) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive"
      }
    }
  });
  if (existingCategory) {
    throw new Error("Category already exists");
  }
  return await prisma.category.create({
    data: { name }
  });
};
var getAllCategories = async () => {
  return await prisma.category.findMany({
    // where: { isActive: true },
    orderBy: { name: "asc" }
  });
};
var updateCategoryStatus = async (id, isActive) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { id },
    select: { id: true, isActive: true }
  });
  if (category.isActive === isActive) {
    throw new Error(
      `Your provided status (${isActive}) is already up to date!`
    );
  }
  return await prisma.category.update({
    where: { id },
    data: { isActive }
  });
};
var categoryService = {
  createCategory,
  getAllCategories,
  updateCategoryStatus
};

// src/modules/categories/category.controller.ts
var createCategory2 = catchAsync_default(async (req, res) => {
  const { name } = req.body;
  const result = await categoryService.createCategory(name);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Category created successfully",
    data: result
  });
});
var getAllCategories2 = catchAsync_default(async (req, res) => {
  const result = await categoryService.getAllCategories();
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Retrieved all categories",
    data: result
  });
});
var updateCategoryStatus2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  const result = await categoryService.updateCategoryStatus(id, isActive);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Updated category status",
    data: result
  });
});
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  updateCategoryStatus: updateCategoryStatus2
};

// src/modules/categories/category.route.ts
var router2 = express2.Router();
router2.get("/", categoryController.getAllCategories);
router2.post("/", requireAuth_default(Role.ADMIN), categoryController.createCategory);
router2.patch(
  "/:id/status",
  requireAuth_default(Role.ADMIN),
  categoryController.updateCategoryStatus
);
var categoryRouter = router2;

// src/modules/bookings/booking.route.ts
import express3 from "express";

// src/modules/bookings/booking.service.ts
import { v7 as uuidv7 } from "uuid";

// src/lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia"
});

// src/modules/bookings/booking.service.ts
var createBooking = async (studentId, availabilityId) => {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: { role: true, status: true }
  });
  if (!student || student.role !== Role.STUDENT) {
    throw new Error("Only students can create bookings");
  }
  if (student.status === UserStatus.BANNED) {
    throw new Error(
      "You cannot book courses as you are banned! Please contact admin"
    );
  }
  const booking = await prisma.$transaction(async (tx) => {
    const availability = await tx.availability.findUniqueOrThrow({
      where: { id: availabilityId },
      include: { tutorProfile: true }
    });
    if (availability.isBooked) {
      throw new Error("This slot is already booked");
    }
    const newBooking = await tx.booking.create({
      data: {
        studentId,
        tutorProfileId: availability.tutorProfileId,
        availabilityId
      }
    });
    await tx.availability.update({
      where: { id: availabilityId },
      data: { isBooked: true }
    });
    const transactionId = String(uuidv7());
    const amount = availability.tutorProfile.hourlyRate ? Number(availability.tutorProfile.hourlyRate) : 0;
    await tx.payment.create({
      data: {
        bookingId: newBooking.id,
        amount,
        transactionId
      }
    });
    return newBooking;
  });
  return booking;
};
var initiatePayment = async (bookingId, studentId) => {
  const bookingData = await prisma.booking.findUnique({
    where: {
      id: bookingId,
      studentId
    },
    include: {
      tutorProfile: true,
      payment: true,
      availability: true
    }
  });
  if (!bookingData) {
    throw new Error("Booking not found");
  }
  if (!bookingData.payment) {
    throw new Error("Payment data not found for this booking");
  }
  if (bookingData.payment.status === PaymentStatus.PAID) {
    throw new Error("Payment already completed for this booking");
  }
  if (bookingData.status === BookingStatus.CANCELLED) {
    throw new Error("Booking is canceled");
  }
  const frontendUrl = process.env.FRONTEND_URL || process.env.APP_URL || "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Session with ${bookingData.tutorProfile.name || "Tutor"}`
          },
          unit_amount: (bookingData.payment.amount || 0) * 100
          // Amount in cents/paisa
        },
        quantity: 1
      }
    ],
    metadata: {
      bookingId: bookingData.id,
      paymentId: bookingData.payment.id
    },
    success_url: `${frontendUrl}/dashboard/payment/payment-success?booking_id=${bookingData.id}&payment_id=${bookingData.payment.id}&tutor_name=${encodeURIComponent(bookingData.tutorProfile.name || "Tutor")}&amount=${bookingData.payment.amount || 0}&start_time=${encodeURIComponent(bookingData.availability.startTime.toISOString())}&end_time=${encodeURIComponent(bookingData.availability.endTime.toISOString())}`,
    cancel_url: `${frontendUrl}/dashboard/student/bookings?error=payment_cancelled`
  });
  return {
    paymentUrl: session.url
  };
};
var getMyBookings = async (userId, role) => {
  if (role === Role.STUDENT) {
    return await prisma.booking.findMany({
      where: { studentId: userId },
      include: {
        availability: true,
        tutorProfile: {
          include: {
            tutorCategories: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });
  }
  if (role === Role.TUTOR) {
    const tutorProfile = await prisma.tutorProfile.findUniqueOrThrow({
      where: { userId }
    });
    return await prisma.booking.findMany({
      where: {
        tutorProfileId: tutorProfile.id
      },
      include: {
        availability: true,
        review: true,
        tutorProfile: {
          include: {
            tutorCategories: {
              include: { category: true }
            }
          }
        }
      }
    });
  }
  return await prisma.booking.findMany({
    include: {
      availability: true,
      review: true,
      tutorProfile: {
        include: {
          tutorCategories: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });
};
var getBookingById = async (bookingId, userId, role) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: {
      tutorProfile: {
        include: {
          tutorCategories: {
            include: {
              category: true
            }
          }
        }
      },
      availability: true,
      review: true
    }
  });
  if (role === Role.STUDENT && booking.studentId !== userId) {
    throw new Error("Unauthorized: you can only see your own booking");
  }
  if (role === Role.TUTOR) {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId }
    });
    if (!tutorProfile || tutorProfile.id !== booking.tutorProfileId) {
      throw new Error("Unauthorized: you can only see your own booking");
    }
  }
  return booking;
};
var updateBookingStatus = async (bookingId, userId, role) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: {
      availability: true
    }
  });
  if (role === Role.STUDENT) {
    if (booking.studentId !== userId) {
      throw new Error("Unauthorized: you cannot update someone else`s booking");
    }
    const now = /* @__PURE__ */ new Date();
    if (now >= booking.availability.startTime) {
      throw new Error("Cannot cancel booking after session start");
    }
    const result = await prisma.$transaction(async (tx) => {
      const res = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED
        }
      });
      await prisma.availability.update({
        where: {
          id: booking.availabilityId
        },
        data: {
          isBooked: false
        }
      });
      return res;
    });
    return result;
  }
  if (role === Role.TUTOR) {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId }
    });
    if (!tutorProfile || tutorProfile.id !== booking.tutorProfileId) {
      throw new Error("Unauthorized: you cannot update someone else`s booking");
    }
    const now = /* @__PURE__ */ new Date();
    if (now <= booking.availability.endTime) {
      throw new Error("You cannot complete the session before it ends");
    }
    return await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.COMPLETED
      }
    });
  }
};
var bookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  initiatePayment
};

// src/modules/bookings/booking.controller.ts
var createBooking2 = catchAsync_default(async (req, res) => {
  if (!req.user) throw new AppError(401, "Unauthorized!");
  const studentId = req.user.id;
  const { availabilityId } = req.body;
  const result = await bookingService.createBooking(studentId, availabilityId);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Booking created successfully",
    data: result
  });
});
var getMyBookings2 = catchAsync_default(async (req, res) => {
  if (!req.user) throw new AppError(401, "Unauthorized!");
  const userId = req.user.id;
  const role = req.user.role;
  const result = await bookingService.getMyBookings(userId, role);
  console.log("BACKEND SENDING RESULT:", JSON.stringify(result).substring(0, 500));
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Retrieved all bookings successfully",
    data: result
  });
});
var getBookingById2 = catchAsync_default(async (req, res) => {
  if (!req.user) throw new AppError(401, "Unauthorized!");
  const bookingId = req.params.id;
  const userId = req.user.id;
  const role = req.user.role;
  const result = await bookingService.getBookingById(bookingId, userId, role);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Retrieved booking successfully",
    data: result
  });
});
var updateBookingStatus2 = catchAsync_default(async (req, res) => {
  if (!req.user) throw new AppError(401, "Unauthorized!");
  const bookingId = req.params.id;
  const userId = req.user.id;
  const role = req.user.role;
  const result = await bookingService.updateBookingStatus(bookingId, userId, role);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Booking updated successfully",
    data: result
  });
});
var initiatePayment2 = catchAsync_default(async (req, res) => {
  const bookingId = req.params.id;
  const user = req.user;
  const paymentInfo = await bookingService.initiatePayment(bookingId, user.id);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Payment initiated successfully",
    data: paymentInfo
  });
});
var bookingController = {
  createBooking: createBooking2,
  getMyBookings: getMyBookings2,
  getBookingById: getBookingById2,
  updateBookingStatus: updateBookingStatus2,
  initiatePayment: initiatePayment2
};

// src/modules/bookings/booking.validation.ts
import { z as z2 } from "zod";
var createBookingValidationSchema = z2.object({
  body: z2.object({
    availabilityId: z2.string().uuid({ message: "Invalid Availability ID" })
  })
});
var bookingValidation = {
  createBookingValidationSchema
};

// src/modules/bookings/booking.route.ts
var router3 = express3.Router();
router3.get("/", requireAuth_default(), bookingController.getMyBookings);
router3.get("/:id", requireAuth_default(), bookingController.getBookingById);
router3.post("/", requireAuth_default(Role.STUDENT), validateRequest_default(bookingValidation.createBookingValidationSchema), bookingController.createBooking);
router3.patch(
  "/:id",
  requireAuth_default(Role.STUDENT, Role.TUTOR),
  bookingController.updateBookingStatus
);
router3.post(
  "/initiate-payment/:id",
  requireAuth_default(Role.STUDENT),
  bookingController.initiatePayment
);
var bookingRouter = router3;

// src/modules/reviews/review.route.ts
import express4 from "express";

// src/modules/reviews/review.service.ts
var createReview = async (studentId, {
  bookingId,
  rating,
  comment
}) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId }
  });
  if (booking.studentId !== studentId) {
    throw new Error("You can only review your own bookings");
  }
  if (booking.status !== BookingStatus.COMPLETED) {
    throw new Error("You can only review a completed session");
  }
  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        bookingId,
        studentId,
        tutorProfileId: booking.tutorProfileId,
        rating,
        comment: comment ?? null
      }
    });
    const ratingAvg = await tx.review.aggregate({
      where: { tutorProfileId: booking.tutorProfileId },
      _avg: { rating: true },
      _count: { id: true }
    });
    await tx.tutorProfile.update({
      where: { id: booking.tutorProfileId },
      data: {
        ratingAvg: ratingAvg._avg.rating,
        totalReviews: ratingAvg._count.id
      }
    });
    return review;
  });
  return result;
};
var getAllReviews = async () => {
  const result = await prisma.review.findMany();
  return result;
};
var reviewService = {
  createReview,
  getAllReviews
};

// src/modules/reviews/review.controller.ts
var createReview2 = catchAsync_default(async (req, res) => {
  if (!req.user) throw new AppError(401, "Unauthorized!");
  if (req.user.status === UserStatus.BANNED) {
    throw new AppError(403, "Unauthorized: you are banned from writing reviews");
  }
  const result = await reviewService.createReview(req.user.id, req.body);
  sendResponse_default(res, {
    statusCode: 201,
    success: true,
    message: "Review submitted successfully",
    data: result
  });
});
var getAllReviews2 = catchAsync_default(async (req, res) => {
  const result = await reviewService.getAllReviews();
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Reviews retrieved successfully",
    data: result
  });
});
var reviewController = {
  createReview: createReview2,
  getAllReviews: getAllReviews2
};

// src/modules/reviews/review.route.ts
var router4 = express4.Router();
router4.get("/", reviewController.getAllReviews);
router4.post("/", requireAuth_default(Role.STUDENT), reviewController.createReview);
var reviewRouter = router4;

// src/modules/admin/admin.route.ts
import express5 from "express";

// src/modules/admin/admin.service.ts
var getAllUsers = async () => {
  return await prisma.user.findMany();
};
var updateUser = async (id, data) => {
  const validStatuses = Object.values(UserStatus);
  if (!validStatuses.includes(data.status)) {
    throw new Error(
      `Invalid status provided. Allowed values are: ${validStatuses.join(", ")}`
    );
  }
  const userStatus = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: { id: true, status: true }
  });
  if (userStatus.status === data.status) {
    throw new Error(
      `Your provided status (${data.status}) is already up to date!`
    );
  }
  return await prisma.user.update({
    where: { id },
    data: { status: data.status }
  });
};
var updateTutorFeaturedStatus = async (tutorProfileId, isFeatured) => {
  const tutorProfile = await prisma.tutorProfile.findUniqueOrThrow({
    where: { id: tutorProfileId }
  });
  if (tutorProfile.isFeatured === isFeatured) {
    throw new Error(
      `Your provided featured status (${isFeatured}) is already up to date!`
    );
  }
  return await prisma.tutorProfile.update({
    where: { id: tutorProfileId },
    data: { isFeatured }
  });
};
var adminService = {
  getAllUsers,
  updateUser,
  updateTutorFeaturedStatus
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = catchAsync_default(async (req, res) => {
  const result = await adminService.getAllUsers();
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Retrieved all users successfully",
    data: result
  });
});
var updateUser2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.updateUser(id, req.body);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Updated user status",
    data: result
  });
});
var updateTutorFeaturedStatus2 = catchAsync_default(async (req, res) => {
  const tutorProfileId = req.params.id;
  const { isFeatured } = req.body;
  const result = await adminService.updateTutorFeaturedStatus(tutorProfileId, isFeatured);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Updated tutor featured status",
    data: result
  });
});
var adminController = {
  getAllUsers: getAllUsers2,
  updateUser: updateUser2,
  updateTutorFeaturedStatus: updateTutorFeaturedStatus2
};

// src/modules/admin/admin.route.ts
var router5 = express5.Router();
router5.get("/users", requireAuth_default(Role.ADMIN), adminController.getAllUsers);
router5.patch("/users/:id", requireAuth_default(Role.ADMIN), adminController.updateUser);
router5.patch(
  "/tutors/:id/isfeatured",
  requireAuth_default(Role.ADMIN),
  adminController.updateTutorFeaturedStatus
);
var adminRouter = router5;

// src/modules/users/user.route.ts
import express6 from "express";

// src/modules/users/user.service.ts
var updateMe = async (userId, payload) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      name: payload.name,
      image: payload.image
    }
  });
};
var getMyStats = async (userId, role) => {
  if (role === Role.STUDENT) {
    return await prisma.$transaction(async (tx) => {
      const [totalBookings, completed, cancelled, upcoming, avgRating] = await Promise.all([
        await tx.booking.count({ where: { studentId: userId } }),
        await tx.booking.count({
          where: { studentId: userId, status: BookingStatus.COMPLETED }
        }),
        await tx.booking.count({
          where: { studentId: userId, status: BookingStatus.CANCELLED }
        }),
        await tx.booking.count({
          where: { studentId: userId, status: BookingStatus.CONFIRMED }
        }),
        await tx.review.aggregate({
          where: { booking: { studentId: userId } },
          _avg: { rating: true }
        })
      ]);
      return {
        totalBookings,
        completed,
        cancelled,
        upcoming,
        avgRating: avgRating._avg.rating
      };
    });
  } else if (role === Role.TUTOR) {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
      select: { id: true }
    });
    if (!tutorProfile) {
      throw new Error("Did not find a tutor profile. Please create one first");
    }
    return await prisma.$transaction(async (tx) => {
      const [totalSessions, completed, upcoming, avgRating] = await Promise.all(
        [
          await tx.booking.count({
            where: { tutorProfileId: tutorProfile.id }
          }),
          await tx.booking.count({
            where: {
              tutorProfileId: tutorProfile.id,
              status: BookingStatus.COMPLETED
            }
          }),
          await tx.booking.count({
            where: {
              tutorProfileId: tutorProfile.id,
              status: BookingStatus.CONFIRMED
            }
          }),
          await tx.review.aggregate({
            where: { booking: { tutorProfileId: tutorProfile.id } },
            _avg: { rating: true }
          })
        ]
      );
      return {
        totalSessions,
        completed,
        upcoming,
        avgRating: avgRating._avg.rating
      };
    });
  } else if (role === Role.ADMIN) {
    return await prisma.$transaction(async (tx) => {
      const [totalUsers, totalBookings, completedBookings, totalTutors] = await Promise.all([
        await tx.user.count(),
        await tx.booking.count(),
        await tx.booking.count({
          where: {
            status: BookingStatus.COMPLETED
          }
        }),
        await tx.tutorProfile.count()
      ]);
      return {
        totalUsers,
        totalTutors,
        totalBookings,
        completedBookings
      };
    });
  }
};
var userService = {
  updateMe,
  getMyStats
};

// src/modules/users/user.controller.ts
var updateMe2 = catchAsync_default(async (req, res) => {
  if (!req.user) throw new AppError(401, "Unauthorized!");
  const userId = req.user.id;
  const result = await userService.updateMe(userId, req.body);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Updated User Profile",
    data: result
  });
});
var getMyStats2 = catchAsync_default(async (req, res) => {
  if (!req.user) throw new AppError(401, "Unauthorized!");
  const userId = req.user.id;
  const role = req.user.role;
  const result = await userService.getMyStats(userId, role);
  sendResponse_default(res, {
    statusCode: 200,
    success: true,
    message: "Retrieved Stats",
    data: result
  });
});
var userController = {
  updateMe: updateMe2,
  getMyStats: getMyStats2
};

// src/modules/users/user.validation.ts
import { z as z3 } from "zod";
var updateMeValidationSchema = z3.object({
  body: z3.object({
    name: z3.string().optional(),
    image: z3.string().url().optional()
  })
});
var userValidation = {
  updateMeValidationSchema
};

// src/modules/users/user.route.ts
var router6 = express6.Router();
router6.get("/stats", requireAuth_default(), userController.getMyStats);
router6.patch("/me", requireAuth_default(), validateRequest_default(userValidation.updateMeValidationSchema), userController.updateMe);
var userRouter = router6;

// src/modules/payments/payment.controller.ts
import status from "http-status";

// src/modules/payments/payment.service.ts
var handlerStripeWebhookEvent = async (event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id
    }
  });
  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      const paymentId = session.metadata?.paymentId;
      if (!bookingId || !paymentId) {
        console.error("\u26A0\uFE0F Missing metadata in webhook event");
        return { message: "Missing metadata" };
      }
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          payment: true
        }
      });
      if (!booking) {
        console.error(
          `\u26A0\uFE0F Booking ${bookingId} not found. Payment may be for expired booking.`
        );
        return { message: "Booking not found" };
      }
      await prisma.$transaction(async (tx) => {
        await tx.booking.update({
          where: {
            id: bookingId
          },
          data: {
            paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID
          }
        });
        await tx.payment.update({
          where: {
            id: paymentId
          },
          data: {
            status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            paymentGatewayData: session,
            stripeEventId: event.id
          }
        });
      });
      console.log(
        `\u2705 Payment ${session.payment_status} updated for Booking ${bookingId}`
      );
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      console.log(
        `Checkout session ${session.id} expired. Marking associated payment as failed.`
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      console.log(
        `Payment intent ${session.id} failed. Marking associated payment as failed.`
      );
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return { message: `Webhook Event ${event.id} processed successfully` };
};
var PaymentService = {
  handlerStripeWebhookEvent
};

// src/modules/payments/payment.controller.ts
var handleStripeWebhookEvent = catchAsync_default(
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "Missing Stripe signature or webhook secret"
      });
    }
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error("Error processing Stripe webhook:", error);
      return res.status(status.BAD_REQUEST).json({ success: false, message: "Error processing Stripe webhook" });
    }
    try {
      const result = await PaymentService.handlerStripeWebhookEvent(event);
      sendResponse_default(res, {
        statusCode: status.OK,
        success: true,
        message: "Stripe webhook event processed successfully",
        data: result
      });
    } catch (error) {
      console.error("Error handling Stripe webhook event:", error);
      sendResponse_default(res, {
        statusCode: status.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Error handling Stripe webhook event",
        data: null
      });
    }
  }
);
var PaymentController = {
  handleStripeWebhookEvent
};

// src/app.ts
var app = express7();
app.set("trust proxy", 1);
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:4000",
  process.env.PROD_APP_URL,
  // Production frontend URL
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5000"
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "x-forwarded-for", "x-forwarded-host", "x-forwarded-proto"],
    exposedHeaders: ["Set-Cookie", "x-forwarded-host", "x-forwarded-proto"]
  })
);
app.post(
  "/api/payments/webhook",
  express7.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent
);
app.use(express7.json());
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.use("/api/users", userRouter);
app.use("/api/tutors", tutorRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SkillBridge API</title>
      <style>
        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background-color: #0f172a;
          color: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          padding: 3rem;
          background: #1e293b;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          border: 1px solid #334155;
          max-width: 600px;
        }
        h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p {
          font-size: 1.125rem;
          color: #94a3b8;
          line-height: 1.75;
          margin-bottom: 2rem;
        }
        .status {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
          background-color: #0d9488;
          color: #ccfbf1;
          border-radius: 9999px;
          font-weight: 500;
          font-size: 0.875rem;
          box-shadow: 0 0 15px rgba(13, 148, 136, 0.4);
        }
        .pulse {
          width: 8px;
          height: 8px;
          background-color: #5eead4;
          border-radius: 50%;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>SkillBridge API \u{1F393}</h1>
        <p>Welcome to the core backend engine powering the SkillBridge platform. All services and endpoints are operating normally.</p>
        <div class="status">
          <div class="pulse"></div>
          System Operational
        </div>
      </div>
    </body>
    </html>
  `);
});
app.use(globalErrorHandler_default);
app.use(notFound);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
