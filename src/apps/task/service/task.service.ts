import mongoose from "mongoose";
import Task from "../model/task.model";
import Project from "../../project/model/project.model";
import AppError from "../../../utils/AppError";

interface CreateTaskInput {
  title: string;
  description?: string;
  projectId: string;
  status?: string;
  priority?: string;
  dueDate?: Date;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date;
}

interface TaskFilters {
  projectId?: string;
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const createTask = async (userId: string, input: CreateTaskInput) => {
  const project = await Project.findOne({ _id: input.projectId, userId });

  if (!project) {
    throw new AppError("Project not found or access denied", 404);
  }

  // 2. Create task
  const task = await Task.create(input);
  return task;
};

export const getTasks = async (userId: string, filters: TaskFilters) => {
  const { projectId, status, priority, search, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const query: any = {};

  // 1. Project Filtering
  if (projectId) {
    // If specific project is requested, verify ownership
    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) throw new AppError("Project not found or access denied", 404);
    query.projectId = projectId;
  } else {
    // Otherwise, get all projects owned by user
    const userProjects = await Project.find({ userId }).select("_id");
    const projectIds = userProjects.map((p) => p._id);
    query.projectId = { $in: projectIds };
  }

  // 2. Status & Priority Filters
  if (status) query.status = status;
  if (priority) query.priority = priority;

  // 3. Search Filter (Using Text Index)
  if (search) {
    query.$text = { $search: search };
  }

  const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Task.countDocuments(query);

  return {
    tasks,
    total,
  };
};

export const getTaskById = async (taskId: string, userId: string) => {
  const task = await Task.findById(taskId).populate("projectId");
  if (!task) throw new AppError("Task not found", 404);

  const project = await Project.findOne({
    _id: task.projectId,
    userId,
  });

  if (!project) throw new AppError("Access denied", 403);

  return task;
};

export const updateTask = async (
  taskId: string,
  userId: string,
  input: UpdateTaskInput,
) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found", 404);

  const project = await Project.findOne({ _id: task.projectId, userId });
  if (!project) throw new AppError("Access denied", 403);

  const updatedTask = await Task.findByIdAndUpdate(taskId, input, {
    new: true,
    runValidators: true,
  });

  return updatedTask;
};

export const deleteTask = async (taskId: string, userId: string) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found", 404);

  const project = await Project.findOne({ _id: task.projectId, userId });
  if (!project) throw new AppError("Access denied", 403);

  await task.deleteOne();

  return { message: "Task deleted successfully" };
};

export const getTaskStats = async (userId: string) => {
  const stats = await Project.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },

    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "projectId",
        as: "tasks",
      },
    },

    { $unwind: { path: "$tasks", preserveNullAndEmptyArrays: true } },

    {
      $group: {
        _id: "$tasks.status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalTasks = stats.reduce(
    (sum: number, s: any) => (s._id ? sum + s.count : sum),
    0,
  );
  const todo = stats.find((s: any) => s._id === "todo")?.count || 0;
  const inProgress =
    stats.find((s: any) => s._id === "in-progress")?.count || 0;
  const completed = stats.find((s: any) => s._id === "completed")?.count || 0;
  const completionRate =
    totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  return {
    totalTasks,
    todo,
    inProgress,
    completed,
    completionRate,
  };
};
