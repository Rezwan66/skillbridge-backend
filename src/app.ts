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

const allowedOrigins = [
  process.env.APP_URL,
  'http://localhost:4000',
  process.env.PROD_APP_URL,
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
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
