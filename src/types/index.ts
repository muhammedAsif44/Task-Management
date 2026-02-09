import { Request } from 'express';
import { Document, Types } from 'mongoose';


export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

export interface IProject extends Document {
    _id: Types.ObjectId;
    name: string;
    description: string;
    userId: Types.ObjectId;
    createdAt: Date;
}


export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ITask extends Document {
    _id: Types.ObjectId;
    title: string;
    description: string;
    projectId: Types.ObjectId;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date;
    createdAt: Date;
}


export interface AuthRequest extends Request {
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface JwtPayload {
    userId: string;
    email: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}

// Task statistics
export interface TaskStats {
    totalTasks: number;
    pending: number;
    inProgress: number;
    completed: number;
    completionRate: number;
}

// Pagination
export interface PaginationQuery {
    page?: number;
    limit?: number;
}

export interface TaskFilterQuery extends PaginationQuery {
    projectId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    search?: string;
}
