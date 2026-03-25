import { z } from 'zod';

const createProfileValidationSchema = z.object({
  body: z.object({
    bio: z.string().min(1, 'Bio is required').optional(),
    name: z.string().min(1, 'Name is required').optional(),
    hourlyRate: z.number().positive().optional(),
    // any other dynamic fields omit their exact checking for flexibility unless specified
  }).passthrough(),
});

const availabilityValidationSchema = z.object({
  body: z.object({
    startTime: z.string().datetime({ message: "Invalid ISO datetime string" }),
    endTime: z.string().datetime({ message: "Invalid ISO datetime string" }),
  }).refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: "endTime must be after startTime",
    path: ["endTime"],
  }),
});

const updateCategoriesValidationSchema = z.object({
  body: z.object({
    categoryIds: z.array(z.string().uuid()),
  }),
});

export const tutorValidation = {
  createProfileValidationSchema,
  availabilityValidationSchema,
  updateCategoriesValidationSchema,
};
