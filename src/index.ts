import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import noteRoutes from './routes/notes.js';
import authRouter from './routes/auth.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import { logger } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Trust the first proxy hop (e.g. Render/Heroku/Railway) so req.ip and the
// rate limiter see the real client IP instead of the proxy's IP.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(noteRoutes);
app.use(authRouter);

app.use(notFoundHandler);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    logger.info('MongoDB connected');
    app.listen(PORT, () => {
      logger.info('Server started', {
        port: PORT,
        env: process.env.NODE_ENV ?? 'development',
      });
    });
  })
  .catch((err) => {
    logger.error(err instanceof Error ? err : new Error(String(err)));
    process.exit(1);
  });
