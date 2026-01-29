import express, { Application } from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import { notFound } from './middlewares/notFound';
import { tutorRouter } from './modules/tutors/tutor.route';
import { categoryRouter } from './modules/categories/category.route';
import { bookingRouter } from './modules/bookings/booking.route';
import { reviewRouter } from './modules/reviews/review.route';
import { adminRouter } from './modules/admin/admin.route';
import { userRouter } from './modules/users/user.route';

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || 'http://localhost:4000',
    credentials: true,
  }),
);

app.use(express.json());

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use('/api/users', userRouter);
// Public
app.use('/api/tutors', tutorRouter);
app.use('/api/categories', categoryRouter);

// Protected
app.use('/api/bookings', bookingRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
  res.send('SkillBridge Server is Running 🎓');
});

app.use(notFound);

export default app;
