import { Request, Response, NextFunction } from "express";
import {
  getProjectById,
  getUserProjects,
  createProjectService,
} from "../service/project.service";

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user!.id;
  const project = await createProjectService(userId, req.body);

  res.status(201).json({
    status: "success",
    message: "Project created successfully",
    data: { project },
  });
};

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user!.id;
  const projects = await getUserProjects(userId);

  res.status(200).json({
    status: "success",
    results: projects.length,
    data: { projects },
  });
};

export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user!.id;
  const projectId = req.params.id as string;
  const project = await getProjectById(projectId, userId);

  res.status(200).json({
    status: "success",
    data: { project },
  });
};
