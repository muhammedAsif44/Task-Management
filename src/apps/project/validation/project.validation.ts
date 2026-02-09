import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";
import AppError from "../../../utils/AppError";

export const createProjectSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Project name is required",
    "string.max": "Project name cannot exceed 100 characters",
  }),
  description: Joi.string().max(500).optional().messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
});


export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    next();
  };
};
