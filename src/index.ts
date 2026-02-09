import express, { Application } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middlewares/globalErrorHandler';
import authRoutes from './apps/auth/routes/auth.routes';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
