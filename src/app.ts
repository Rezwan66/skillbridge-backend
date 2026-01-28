import express, { Application } from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import requireAuth from './middlewares/requireAuth';
import { notFound } from './middlewares/notFound';

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || 'http://localhost:4000',
    credentials: true,
  }),
);

app.use(express.json());

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.get('/', requireAuth(), (req, res) => {
  res.send('SkillBridge Server is Running 🎓');
});

app.use(notFound);

export default app;
