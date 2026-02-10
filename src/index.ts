import express, { Application } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middlewares/globalErrorHandler';
import authRoutes from './apps/auth/routes/auth.routes';
import projectRoutes from './apps/project/routes/project.routes';
import taskRoutes from './apps/task/routes/task.routes';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);


app.use(globalErrorHandler);

export default app;
