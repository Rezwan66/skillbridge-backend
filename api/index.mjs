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
  "inlineSchema": 'model User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  role          String\n  status        String?   @default("ACTIVE")\n  sessions      Session[]\n  accounts      Account[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Availability {\n  id             String   @id @default(uuid())\n  tutorProfileId String\n  startTime      DateTime\n  endTime        DateTime\n  isBooked       Boolean  @default(false)\n\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  booking      Booking?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Booking {\n  id             String        @id @default(uuid())\n  studentId      String //* better-auth\n  tutorProfileId String\n  availabilityId String        @unique\n  status         BookingStatus @default(CONFIRMED)\n\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  availability Availability @relation(fields: [availabilityId], references: [id])\n  review       Review?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Category {\n  id              String          @id @default(uuid())\n  name            String          @db.VarChar(225)\n  isActive        Boolean         @default(true)\n  createdAt       DateTime        @default(now())\n  updatedAt       DateTime        @updatedAt\n  tutorCategories TutorCategory[]\n}\n\nmodel TutorCategory {\n  id             String @id @default(uuid())\n  tutorProfileId String\n  categoryId     String\n\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  category     Category     @relation(fields: [categoryId], references: [id])\n}\n\nenum Role {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum BookingStatus {\n  CONFIRMED\n  CANCELLED\n  COMPLETED\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nmodel Review {\n  id             String @id @default(uuid())\n  bookingId      String @unique\n  studentId      String //* better-auth\n  tutorProfileId String\n\n  rating  Int\n  comment String? @db.Text\n\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  booking      Booking      @relation(fields: [bookingId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel TutorProfile {\n  id              String   @id @default(uuid())\n  userId          String   @unique //* better-auth\n  bio             String?  @db.VarChar(255)\n  name            String?\n  hourlyRate      Decimal?\n  experienceYears Int?\n  ratingAvg       Decimal?\n  totalReviews    Int?\n  isFeatured      Boolean? @default(false)\n\n  tutorCategories TutorCategory[]\n  availabilities  Availability[]\n  bookings        Booking[]\n  reviews         Review[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"},{"name":"booking","kind":"object","type":"Booking","relationName":"AvailabilityToBooking"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"availabilityId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToBooking"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"tutorCategories","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"}],"dbName":null},"TutorCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Decimal"},{"name":"experienceYears","kind":"scalar","type":"Int"},{"name":"ratingAvg","kind":"scalar","type":"Decimal"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"tutorCategories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"availabilities","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
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
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
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

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
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

// src/modules/tutors/tutor.controller.ts
var createProfile2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    const { id, name } = req.user;
    const result = await tutorService.createProfile(
      id,
      // name as string,
      req.body
    );
    res.status(201).json({
      message: `${result.created ? "Created" : "Updated"} Tutor Profile`,
      data: result.result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Profile creation or update failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var createAvailability2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    const result = await tutorService.createAvailability(
      req.user.id,
      req.body
    );
    res.status(201).json({
      message: "Created Tutor Availability",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Availability Creation Failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var updateAvailability2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    const result = await tutorService.updateAvailability(
      req.params.id,
      req.user.id,
      req.body
    );
    res.status(200).json({
      message: "Updated Tutor Availability",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Availability Update Failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var updateTutorCategories2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    const userId = req.user.id;
    const { categoryIds } = req.body;
    const result = await tutorService.updateTutorCategories(
      userId,
      categoryIds
    );
    res.status(200).json({
      message: "Updated Tutor Categories",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Category Update Failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var getAllTutors2 = async (req, res) => {
  try {
    const result = await tutorService.getAllTutors(
      req.query
    );
    res.status(200).json({
      message: "Retrieved tutors successfully",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Tutors retrieval failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var getTutorById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await tutorService.getTutorById(id);
    res.status(200).json({
      message: "Retrieved tutor successfully",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Tutor retrieval failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var getMyTutorProfile2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    const result = await tutorService.getMyTutorProfile(req.user.id);
    console.log(result);
    res.status(200).json({
      message: "Retrieved tutor successfully",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Tutor retrieval failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
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
      console.log("from requireAuth-->", session?.user);
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!"
        });
      }
      if (roles.length && !roles.includes(session.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don`t have permission to access this resource."
        });
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

// src/modules/tutors/tutor.route.ts
var router = express.Router();
router.get("/", tutorController.getAllTutors);
router.get(
  "/my-profile",
  requireAuth_default(Role.TUTOR),
  tutorController.getMyTutorProfile
);
router.get("/:id", tutorController.getTutorById);
router.put("/profile", requireAuth_default(Role.TUTOR), tutorController.createProfile);
router.post(
  "/availability",
  requireAuth_default(Role.TUTOR),
  tutorController.createAvailability
);
router.put(
  "/availability/:id",
  requireAuth_default(Role.TUTOR),
  tutorController.updateAvailability
);
router.put("/categories", requireAuth_default(), tutorController.updateTutorCategories);
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
var createCategory2 = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await categoryService.createCategory(name);
    res.status(201).json({
      message: "Category created successfully",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Category creation failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var getAllCategories2 = async (req, res) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).json({
      message: "Retrieved all categories",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Availability Creation Failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var updateCategoryStatus2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const result = await categoryService.updateCategoryStatus(
      id,
      isActive
    );
    res.status(200).json({
      message: "Updated category status",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Category status update failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
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
    return newBooking;
  });
  return booking;
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
  updateBookingStatus
};

// src/modules/bookings/booking.controller.ts
var createBooking2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    const studentId = req.user.id;
    const { availabilityId } = req.body;
    const result = await bookingService.createBooking(
      studentId,
      availabilityId
    );
    res.status(201).json({
      message: "Booking created successfully",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Availability Creation Failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var getMyBookings2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    const userId = req.user.id;
    const role = req.user.role;
    const result = await bookingService.getMyBookings(userId, role);
    res.status(200).json({
      message: "Retrieved all bookings successfully",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Cannot get bookings";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var getBookingById2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    const bookingId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;
    const result = await bookingService.getBookingById(bookingId, userId, role);
    res.status(200).json({
      message: "Retrieved booking successfully",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Cannot get booking";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var updateBookingStatus2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    const bookingId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;
    const result = await bookingService.updateBookingStatus(
      bookingId,
      userId,
      role
    );
    res.status(200).json({
      message: "Booking updated successfully",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Cannot update booking";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var bookingController = {
  createBooking: createBooking2,
  getMyBookings: getMyBookings2,
  getBookingById: getBookingById2,
  updateBookingStatus: updateBookingStatus2
};

// src/modules/bookings/booking.route.ts
var router3 = express3.Router();
router3.get("/", requireAuth_default(), bookingController.getMyBookings);
router3.get("/:id", requireAuth_default(), bookingController.getBookingById);
router3.post("/", requireAuth_default(Role.STUDENT), bookingController.createBooking);
router3.patch(
  "/:id",
  requireAuth_default(Role.STUDENT, Role.TUTOR),
  bookingController.updateBookingStatus
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
var createReview2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    if (req.user.status === UserStatus.BANNED) {
      return res.status(400).json({
        error: "Unauthorized: you are banned from writing reviews"
      });
    }
    const result = await reviewService.createReview(
      req.user.id,
      req.body
    );
    res.status(201).json({
      message: "Review submitted successfully",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to submit review";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var getAllReviews2 = async (req, res) => {
  try {
    const result = await reviewService.getAllReviews();
    res.status(200).json({
      message: "Reviews retrieved successfully",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve reviews";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
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
var getAllUsers2 = async (req, res) => {
  try {
    const result = await adminService.getAllUsers();
    res.status(200).json({
      message: "Retrieved all users successfully",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Cannot get users";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var updateUser2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await adminService.updateUser(id, req.body);
    res.status(200).json({
      message: "Updated user status",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "User status update failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var updateTutorFeaturedStatus2 = async (req, res) => {
  try {
    const tutorProfileId = req.params.id;
    const { isFeatured } = req.body;
    const result = await adminService.updateTutorFeaturedStatus(
      tutorProfileId,
      isFeatured
    );
    res.status(200).json({
      message: "Updated tutor featured status",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Tutor featured status update failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
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
var updateMe2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    const userId = req.user.id;
    const result = await userService.updateMe(userId, req.body);
    res.status(200).json({
      message: `Updated User Profile`,
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Profile update failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var getMyStats2 = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorized!"
      });
    }
    const userId = req.user.id;
    const role = req.user.role;
    const result = await userService.getMyStats(userId, role);
    res.status(200).json({
      message: `Retrieved Stats`,
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Profile update failed";
    res.status(400).json({
      error: errorMessage,
      details: error
    });
  }
};
var userController = {
  updateMe: updateMe2,
  getMyStats: getMyStats2
};

// src/modules/users/user.route.ts
var router6 = express6.Router();
router6.get("/stats", requireAuth_default(), userController.getMyStats);
router6.patch("/me", requireAuth_default(), userController.updateMe);
var userRouter = router6;

// src/app.ts
var app = express7();
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
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
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
  res.send("SkillBridge Server is Running \u{1F393}");
});
app.use(notFound);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
