import { Request, Response } from 'express';
import * as taskService from '../service/task.service';


export const createTask = async (req: Request, res: Response,) => {
  const userId = req.user!.id;
  const task = await taskService.createTask(userId, req.body);
  res.status(201).json({
    status: 'success',
    message: 'Task created successfully',
    data: { task },
  });
};


export const getTasks = async (req: Request, res: Response,) => {
  const userId = req.user!.id;
  const filters = {
    projectId: req.query.projectId as string | undefined,
    status: req.query.status as string | undefined,
    priority: req.query.priority as string | undefined,
    search: req.query.search as string | undefined,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  };

  const result = await taskService.getTasks(userId, filters);

  res.status(200).json({
    status: 'success',
    total: result.total,
    tasks: result.tasks,
  });
};

export const getTask = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const taskId = req.params.id as string;
  const task = await taskService.getTaskById(taskId, userId);
  res.status(200).json({
    status: 'success',
    data: { task },
  });
};


export const updateTask = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const taskId = req.params.id as string;
  const task = await taskService.updateTask(taskId, userId, req.body);

  res.status(200).json({
    status: 'success',
    message: 'Task updated successfully',
    data: { task },
  });
};


export const deleteTask = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const taskId = req.params.id as string;
  await taskService.deleteTask(taskId, userId);

  res.status(200).json({
    status: 'success',
    message: 'Task deleted successfully',
  });
};
