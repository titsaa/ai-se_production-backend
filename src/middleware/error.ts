import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    data: null,
    error: { message: `Route ${req.method} ${req.path} not found` },
  });
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(err);
  res.status(500).json({
    success: false,
    data: null,
    error: { message: err.message || 'Internal server error' },
  });
};
