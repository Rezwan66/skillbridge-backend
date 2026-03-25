import { z } from 'zod';

const createBookingValidationSchema = z.object({
  body: z.object({
    availabilityId: z.string().uuid({ message: "Invalid Availability ID" }),
  }),
});

export const bookingValidation = {
  createBookingValidationSchema,
};
