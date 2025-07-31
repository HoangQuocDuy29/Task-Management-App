import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { RequestContext } from '@mikro-orm/core';
import routes from './routes/index.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  }
});

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global ORM variable
let globalOrm: any = null;

// RequestContext middleware - IMPORTANT: Must be before routes
app.use((req, res, next) => {
  if (globalOrm) {
    RequestContext.create(globalOrm.em, next);
  } else {
    console.error('⚠️ ORM not initialized for request:', req.path);
    next();
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Task Management API',
    version: '1.0.0',
    database: process.env.DB_NAME,
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    data: {
      status: 'OK',
      database: globalOrm ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }
  });
});

app.use('/api/v1', routes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

// Export function to set ORM
export const setORM = (ormInstance: any) => {
  globalOrm = ormInstance;
  console.log('✅ ORM set for RequestContext');
};

export default app;