import { TutorProfile } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

const createProfile = async (
  id: string,
  data: Omit<TutorProfile, 'id' | 'createdAt' | 'updatedAt' | 'userId'>,
) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId: id,
    },
  });

  const ratingAggResult = await prisma.review.aggregate({
    _avg: { rating: true },
    where: { tutorProfileId: id },
  });
  const totalReviews = await prisma.review.count({
    where: { tutorProfileId: id },
  });

  if (tutorProfile) {
    const result = await prisma.tutorProfile.update({
      where: { id: tutorProfile.id },
      data: {
        ...tutorProfile,
        ...data,
        ratingAvg: ratingAggResult._avg.rating,
        totalReviews,
        isFeatured: false,
      },
    });
    return { result, created: false };
  }
  const result = await prisma.tutorProfile.create({
    data: {
      ...data,
      userId: id,
      ratingAvg: ratingAggResult._avg.rating,
      totalReviews,
      isFeatured: false,
    },
  });
  return { result, created: true };
};

const updateAvailability = async (
  id: string,
  { startTime, endTime }: { startTime: Date; endTime: Date },
) => {
  if (startTime >= endTime) {
    throw new Error('Invalid input date range. Please check again.');
  }

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId: id,
    },
  });

  if (!tutorProfile) {
    throw new Error(
      'You do not have a tutor profile. Create a tutor profile first to set availability.',
    );
  }

  //   const tutorAvail = await prisma.availability.findMany({
  //     where: {
  //       tutorProfileId: tutorProfile.id,
  //     },
  //   });

  //   console.log(tutorAvail);

  const result = await prisma.availability.create({
    data: {
      tutorProfileId: tutorProfile?.id,
      startTime,
      endTime,
    },
  });
  return { result, created: true };
};

export const tutorService = { createProfile, updateAvailability };
