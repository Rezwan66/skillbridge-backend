import {
  BookingStatus,
  Role,
  UserStatus,
} from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

const createBooking = async (studentId: string, availabilityId: string) => {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: { role: true, status: true },
  });

  if (!student || student.role !== Role.STUDENT) {
    throw new Error('Only students can create bookings');
  }

  if (student.status === UserStatus.BANNED) {
    throw new Error(
      'You cannot book courses as you are banned! Please contact admin',
    );
  }

  const booking = await prisma.$transaction(async tx => {
    const availability = await tx.availability.findUniqueOrThrow({
      where: { id: availabilityId },
      include: { tutorProfile: true },
    });

    if (availability.isBooked) {
      throw new Error('This slot is already booked');
    }

    const newBooking = await tx.booking.create({
      data: {
        studentId,
        tutorProfileId: availability.tutorProfileId,
        availabilityId,
      },
    });

    await tx.availability.update({
      where: { id: availabilityId },
      data: { isBooked: true },
    });

    return newBooking;
  });

  return booking;
};

const getMyBookings = async (userId: string, role: Role) => {
  if (role === Role.STUDENT) {
    return await prisma.booking.findMany({
      where: { studentId: userId },
      include: {
        availability: true,

        tutorProfile: {
          include: {
            tutorCategories: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });
  }
  if (role === Role.TUTOR) {
    const tutorProfile = await prisma.tutorProfile.findUniqueOrThrow({
      where: { userId },
    });
    return await prisma.booking.findMany({
      where: {
        tutorProfileId: tutorProfile.id,
      },
      include: {
        availability: true,
        review: true,
        tutorProfile: {
          include: {
            tutorCategories: {
              include: { category: true },
            },
          },
        },
      },
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
              category: true,
            },
          },
        },
      },
    },
  });
};

const getBookingById = async (
  bookingId: string,
  userId: string,
  role: Role,
) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: {
      tutorProfile: true,
      availability: true,
      review: true,
    },
  });

  if (role === Role.STUDENT && booking.studentId !== userId) {
    throw new Error('Unauthorized: you can only see your own booking');
  }

  if (role === Role.TUTOR) {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutorProfile || tutorProfile.id !== booking.tutorProfileId) {
      throw new Error('Unauthorized: you can only see your own booking');
    }
  }

  return booking;
};

const updateBookingStatus = async (
  bookingId: string,
  userId: string,
  role: Role,
) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: {
      availability: true,
    },
  });

  if (role === Role.STUDENT) {
    if (booking.studentId !== userId) {
      throw new Error('Unauthorized: you cannot update someone else`s booking');
    }
    const now = new Date();
    if (now >= booking.availability.startTime) {
      throw new Error('Cannot cancel booking after session start');
    }

    return await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });
  }

  if (role === Role.TUTOR) {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutorProfile || tutorProfile.id !== booking.tutorProfileId) {
      throw new Error('Unauthorized: you cannot update someone else`s booking');
    }

    const now = new Date();
    if (now <= booking.availability.endTime) {
      throw new Error('You cannot complete the session before it ends');
    }

    return await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.COMPLETED,
      },
    });
  }
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
};
