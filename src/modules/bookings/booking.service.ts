import {
  BookingStatus,
  PaymentStatus,
  Role,
  UserStatus,
} from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { v7 as uuidv7 } from 'uuid';
import { stripe } from '../../lib/stripe';

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
    
    const transactionId = String(uuidv7());
    const amount = availability.tutorProfile.hourlyRate ? Number(availability.tutorProfile.hourlyRate) : 0;

    await tx.payment.create({
      data: {
        bookingId: newBooking.id,
        amount: amount,
        transactionId,
      }
    });

    return newBooking;
  });

  return booking;
};

const initiatePayment = async (bookingId: string, studentId: string) => {
  const bookingData = await prisma.booking.findUnique({
    where: {
      id: bookingId,
      studentId: studentId,
    },
    include: {
      tutorProfile: true,
      payment: true,
      availability: true,
    }
  });

  if (!bookingData) {
    throw new Error("Booking not found");
  }

  if (!bookingData.payment) {
    throw new Error("Payment data not found for this booking");
  }

  if (bookingData.payment.status === PaymentStatus.PAID) {
    throw new Error("Payment already completed for this booking");
  }

  if (bookingData.status === BookingStatus.CANCELLED) {
    throw new Error("Booking is canceled");
  }

  const frontendUrl = process.env.FRONTEND_URL || process.env.APP_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Session with ${bookingData.tutorProfile.name || 'Tutor'}`,
          },
          unit_amount: (bookingData.payment.amount || 0) * 100, // Amount in cents/paisa
        },
        quantity: 1,
      }
    ],
    metadata: {
      bookingId: bookingData.id,
      paymentId: bookingData.payment.id,
    },
    success_url: `${frontendUrl}/dashboard/payment/payment-success?booking_id=${bookingData.id}&payment_id=${bookingData.payment.id}&tutor_name=${encodeURIComponent(bookingData.tutorProfile.name || 'Tutor')}&amount=${bookingData.payment.amount || 0}&start_time=${encodeURIComponent(bookingData.availability.startTime.toISOString())}&end_time=${encodeURIComponent(bookingData.availability.endTime.toISOString())}`,
    cancel_url: `${frontendUrl}/dashboard/student/bookings?error=payment_cancelled`,
  });

  return {
    paymentUrl: session.url,
  }
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
      tutorProfile: {
        include: {
          tutorCategories: {
            include: {
              category: true,
            },
          },
        },
      },
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

    // return await prisma.booking.update({
    //   where: { id: bookingId },
    //   data: {
    //     status: BookingStatus.CANCELLED,
    //   },
    // });

    const result = await prisma.$transaction(async tx => {
      const res = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
        },
      });

      await prisma.availability.update({
        where: {
          id: booking.availabilityId,
        },
        data: {
          isBooked: false,
        },
      });
      return res;
    });

    return result;
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
  initiatePayment,
};
