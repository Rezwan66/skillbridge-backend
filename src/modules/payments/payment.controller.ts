/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import status from 'http-status';
import { stripe } from '../../lib/stripe';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { PaymentService } from './payment.service';

const handleStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      console.error('Missing Stripe signature or webhook secret');
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: 'Missing Stripe signature or webhook secret',
      });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (error: any) {
      console.error('Error processing Stripe webhook:', error);
      return res
        .status(status.BAD_REQUEST)
        .json({ success: false, message: 'Error processing Stripe webhook' });
    }

    try {
      const result = await PaymentService.handlerStripeWebhookEvent(event);

      sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Stripe webhook event processed successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error handling Stripe webhook event:', error);
      sendResponse(res, {
        statusCode: status.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Error handling Stripe webhook event',
        data: null
      });
    }
  },
);

export const PaymentController = {
  handleStripeWebhookEvent,
};
