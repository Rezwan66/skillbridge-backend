import { BookingStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

const createReview = async (
  studentId: string,
  {
    bookingId,
    rating,
    comment,
  }: {
    bookingId: string;
    rating: number;
    comment?: string;
  },
) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
  });

  if (booking.studentId !== studentId) {
    throw new Error('You can only review your own bookings');
  }

  if (booking.status !== BookingStatus.COMPLETED) {
    throw new Error('You can only review a completed session');
  }

  const result = await prisma.$transaction(async tx => {
    // create review
    const review = await tx.review.create({
      data: {
        bookingId,
        studentId,
        tutorProfileId: booking.tutorProfileId,
        rating,
        comment: comment ?? null,
      },
    });

    // update tutor profile ratingAvg and totalReviews
    const ratingAvg = await tx.review.aggregate({
      where: { tutorProfileId: booking.tutorProfileId },
      _avg: { rating: true },
      _count: { id: true },
    });

    await tx.tutorProfile.update({
      where: { id: booking.tutorProfileId },
      data: {
        ratingAvg: ratingAvg._avg.rating,
        totalReviews: ratingAvg._count.id,
      },
    });

    return review;
  });

  return result;
};

const getAllReviews = async () => {
  const result = await prisma.review.findMany();

  return result;
};

export const reviewService = {
  createReview,
  getAllReviews,
};
