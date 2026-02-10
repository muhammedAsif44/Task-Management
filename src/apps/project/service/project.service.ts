import Project from "../model/project.model";
import AppError from "../../../utils/AppError";

interface CreateProjectInput {
  name: string;
  description?: string;
}

export const createProjectService = async (
  userId: string,
  body: CreateProjectInput,
) => {
  const project = await Project.create({
    name: body.name,
    description: body.description,
    userId: userId,
  });

  return project;
};

export const getUserProjects = async (userId: string) => {
  const projects = await Project.find({ userId }).sort({ createdAt: -1 });
  return projects;
};

export const getProjectById = async (projectId: string, userId: string) => {
  const project = await Project.findOne({ _id: projectId, userId });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};
