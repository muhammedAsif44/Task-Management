import Joi, { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../../../utils/AppError';

export const createTaskSchema = Joi.object({
    title: Joi.string().min(1).max(200).required().messages({
        'string.empty': 'Task title is required',
        'string.max': 'Title cannot exceed 200 characters',
    }),
    description: Joi.string().max(1000).optional(),
    projectId: Joi.string().required().messages({
        'string.empty': 'Project ID is required',
    }),
    status: Joi.string().valid('todo', 'in-progress', 'completed').optional(),
    priority: Joi.string().valid('low', 'medium', 'high').optional(),
    dueDate: Joi.date().optional(),
});

export const updateTaskSchema = Joi.object({
    title: Joi.string().min(1).max(200).optional(),
    description: Joi.string().max(1000).optional(),
    status: Joi.string().valid('todo', 'in-progress', 'completed').optional(),
    priority: Joi.string().valid('low', 'medium', 'high').optional(),
    dueDate: Joi.date().optional(),
});

// Validation middleware factory
export const validate = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new AppError(error.details[0].message, 400));
        }
        next();
    };
};
