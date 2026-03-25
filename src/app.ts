import express, { Application } from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import { notFound } from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorHandler';
import { tutorRouter } from './modules/tutors/tutor.route';
import { categoryRouter } from './modules/categories/category.route';
import { bookingRouter } from './modules/bookings/booking.route';
import { reviewRouter } from './modules/reviews/review.route';
import { adminRouter } from './modules/admin/admin.route';
import { userRouter } from './modules/users/user.route';

const app: Application = express();

// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
  process.env.APP_URL || 'http://localhost:4000',
  process.env.PROD_APP_URL, // Production frontend URL
  'http://localhost:3000',
  'http://localhost:4000',
  'http://localhost:5000',
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
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto'],
    exposedHeaders: ['Set-Cookie', 'x-forwarded-host', 'x-forwarded-proto'],
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


// Main homepage route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SkillBridge API</title>
      <style>
        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background-color: #0f172a;
          color: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          padding: 3rem;
          background: #1e293b;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          border: 1px solid #334155;
          max-width: 600px;
        }
        h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p {
          font-size: 1.125rem;
          color: #94a3b8;
          line-height: 1.75;
          margin-bottom: 2rem;
        }
        .status {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
          background-color: #0d9488;
          color: #ccfbf1;
          border-radius: 9999px;
          font-weight: 500;
          font-size: 0.875rem;
          box-shadow: 0 0 15px rgba(13, 148, 136, 0.4);
        }
        .pulse {
          width: 8px;
          height: 8px;
          background-color: #5eead4;
          border-radius: 50%;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>SkillBridge API 🎓</h1>
        <p>Welcome to the core backend engine powering the SkillBridge platform. All services and endpoints are operating normally.</p>
        <div class="status">
          <div class="pulse"></div>
          System Operational
        </div>
      </div>
    </body>
    </html>
  `);
});

// Global error handler
app.use(globalErrorHandler);
app.use(notFound);

export default app;
