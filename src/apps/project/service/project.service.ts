import Project from "../model/project.model";
import AppError from "../../../utils/AppError";

// ============ Types ============
interface CreateProjectInput {
  name: string;
  description?: string;
}

// ============ Service Functions ============

/**
 * Create a new project for a user
 */
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

/**
 * Get all projects for a user
 */
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
