import { TutorProfile } from '../../../generated/prisma/client';
import { TutorProfileWhereInput } from '../../../generated/prisma/models';
import { prisma } from '../../lib/prisma';

const createProfile = async (
  id: string,
  name: string,
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
        name,
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
      name,
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

const getAllTutors = async ({
  search,
  categoryId,
  minRating,
  maxPrice,
  isFeatured,
}: {
  search: string | undefined;
  categoryId: string | undefined;
  minRating: number | undefined;
  maxPrice: number | undefined;
  isFeatured: boolean;
}) => {
  const andConditions: TutorProfileWhereInput | TutorProfileWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          bio: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          tutorCategories: {
            some: {
              category: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
      ],
    });
  }

  if (minRating) {
    andConditions.push({
      ratingAvg: {
        gte: Number(minRating),
      },
    });
  }

  if (maxPrice) {
    andConditions.push({
      hourlyRate: {
        lte: Number(maxPrice),
      },
    });
  }

  if (isFeatured !== undefined) {
    andConditions.push({
      isFeatured: Boolean(isFeatured),
    });
  }

  if (categoryId) {
    andConditions.push({
      tutorCategories: {
        some: { categoryId },
      },
    });
  }

  const allTutors = await prisma.tutorProfile.findMany({
    where: { AND: andConditions },
    include: {
      tutorCategories: { include: { category: true } },
      availabilities: true,
      bookings: true,
      reviews: true,
    },
  });

  return allTutors;
};

const getTutorById = async (id: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      reviews: true,
      tutorCategories: {
        include: { category: { select: { name: true } } },
      },
      availabilities: true,
    },
  });

  if (!tutor) {
    throw new Error('Tutor not found');
  }

  return tutor;
};

export const tutorService = {
  createProfile,
  createAvailability,
  updateAvailability,
  updateTutorCategories,
  getAllTutors,
  getTutorById,
};
