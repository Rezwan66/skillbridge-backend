import { BookingStatus, Role } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

interface AllowedFields {
  name: string;
  image: string;
}

const updateMe = async (userId: string, payload: AllowedFields) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      name: payload.name,
      image: payload.image,
    },
  });
};

const getMyStats = async (userId: string, role: Role) => {
  if (role === Role.STUDENT) {
    return await prisma.$transaction(async tx => {
      const [totalBookings, completed, cancelled, upcoming, avgRating] =
        await Promise.all([
          await tx.booking.count({ where: { studentId: userId } }),
          await tx.booking.count({
            where: { studentId: userId, status: BookingStatus.COMPLETED },
          }),
          await tx.booking.count({
            where: { studentId: userId, status: BookingStatus.CANCELLED },
          }),
          await tx.booking.count({
            where: { studentId: userId, status: BookingStatus.CONFIRMED },
          }),
          await tx.review.aggregate({
            where: { booking: { studentId: userId } },
            _avg: { rating: true },
          }),
        ]);

      return {
        totalBookings,
        completed,
        cancelled,
        upcoming,
        avgRating: avgRating._avg.rating,
      };
    });
  } else if (role === Role.TUTOR) {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!tutorProfile) {
      throw new Error('Did not find a tutor profile. Please create one first');
    }

    return await prisma.$transaction(async tx => {
      const [totalSessions, completed, upcoming, avgRating] = await Promise.all(
        [
          await tx.booking.count({
            where: { tutorProfileId: tutorProfile.id },
          }),
          await tx.booking.count({
            where: {
              tutorProfileId: tutorProfile.id,
              status: BookingStatus.COMPLETED,
            },
          }),
          await tx.booking.count({
            where: {
              tutorProfileId: tutorProfile.id,
              status: BookingStatus.CONFIRMED,
            },
          }),
          await tx.review.aggregate({
            where: { booking: { tutorProfileId: tutorProfile.id } },
            _avg: { rating: true },
          }),
        ],
      );

      return {
        totalSessions,
        completed,
        upcoming,
        avgRating: avgRating._avg.rating,
      };
    });
  } else if (role === Role.ADMIN) {
    return await prisma.$transaction(async tx => {
      const [totalUsers, totalBookings, completedBookings, totalTutors] =
        await Promise.all([
          await tx.user.count(),
          await tx.booking.count(),
          await tx.booking.count({
            where: {
              status: BookingStatus.COMPLETED,
            },
          }),
          await tx.tutorProfile.count(),
        ]);

      return {
        totalUsers,
        totalTutors,
        totalBookings,
        completedBookings,
      };
    });
  }
};

export const userService = {
  updateMe,
  getMyStats,
};
