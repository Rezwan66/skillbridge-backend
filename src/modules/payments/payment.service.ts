/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from 'stripe';
import { PaymentStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id,
    },
  });

  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;

      const bookingId = session.metadata?.bookingId;
      const paymentId = session.metadata?.paymentId;

      if (!bookingId || !paymentId) {
        console.error('⚠️ Missing metadata in webhook event');
        return { message: 'Missing metadata' };
      }

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          payment: true,
        },
      });

      if (!booking) {
        console.error(
          `⚠️ Booking ${bookingId} not found. Payment may be for expired booking.`,
        );
        return { message: 'Booking not found' };
      }

      await prisma.$transaction(async tx => {
        await tx.booking.update({
          where: {
            id: bookingId,
          },
          data: {
            paymentStatus:
              session.payment_status === 'paid'
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
          },
        });

        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            status:
              session.payment_status === 'paid'
                ? PaymentStatus.PAID
                : PaymentStatus.UNPAID,
            paymentGatewayData: session,
            stripeEventId: event.id,
          },
        });
      });

      console.log(
        `✅ Payment ${session.payment_status} updated for Booking ${bookingId}`,
      );
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object;
      console.log(
        `Checkout session ${session.id} expired. Marking associated payment as failed.`,
      );
      break;
    }
    case 'payment_intent.payment_failed': {
      const session = event.data.object;
      console.log(
        `Payment intent ${session.id} failed. Marking associated payment as failed.`,
      );
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { message: `Webhook Event ${event.id} processed successfully` };
};

export const PaymentService = {
  handlerStripeWebhookEvent,
};
