import { z } from 'zod';

const updateMeValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    image: z.string().url().optional(),
  }),
});

export const userValidation = {
  updateMeValidationSchema,
};
