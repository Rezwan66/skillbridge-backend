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

const createAvailability = async (
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
  return result;
};

const updateAvailability = async (
  id: string,
  tutorId: string,
  { startTime, endTime }: { startTime: Date; endTime: Date },
) => {
  if (startTime >= endTime) {
    throw new Error('Invalid input date range. Please check again.');
  }

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId: tutorId,
    },
  });

  if (!tutorProfile) {
    throw new Error('Tutor profile not found.');
  }

  const availability = await prisma.availability.findUnique({
    where: { id },
  });

  if (!availability || availability.tutorProfileId !== tutorProfile.id) {
    throw new Error('Unauthorized or availability not found.');
  }

  if (availability.isBooked) {
    throw new Error('Cannot update a booked slot.');
  }

  const result = await prisma.availability.update({
    where: {
      id,
    },
    data: {
      startTime,
      endTime,
    },
  });
  return result;
};

const updateTutorCategories = async (userId: string, categoryIds: string[]) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!tutorProfile) {
    throw new Error('Tutor profile not found.');
  }

  const validCategories = await prisma.category.findMany({
    where: {
      id: { in: categoryIds },
      isActive: true,
    },
  });

  if (validCategories.length !== categoryIds.length) {
    throw new Error('One or more categories are invalid');
  }

  // delete all stale categories
  await prisma.tutorCategory.deleteMany({
    where: { tutorProfileId: tutorProfile.id },
  });

  // create new categories in TutorCategory table
  return await prisma.tutorCategory.createMany({
    data: categoryIds.map(categoryId => ({
      tutorProfileId: tutorProfile.id,
      categoryId,
    })),
  });
};

export const tutorService = {
  createProfile,
  createAvailability,
  updateAvailability,
  updateTutorCategories,
};
