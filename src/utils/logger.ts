import winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

const format = winston.format.combine(
  winston.format.errors({ stack: true }),
  ...(isProduction
    ? [winston.format.timestamp(), winston.format.json()]
    : [winston.format.colorize(), winston.format.simple()]),
);

export const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format,
  transports: [new winston.transports.Console()],
});
