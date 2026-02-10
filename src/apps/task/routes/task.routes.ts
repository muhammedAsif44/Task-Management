import { Router } from "express";
import {
  validate,
  createTaskSchema,
  updateTaskSchema,
} from "../validation/task.validation";
import tryCatch from "../../../utils/tryCatch";
import protectMiddleware from "../../../middlewares/protectMiddleware";
import {
  createTask,
  deleteTask,
  getTaskById,
  getAllTasks,
  getTaskStats,
  updateTask,
} from "../controller/task.controller";

const router = Router();

router.use(protectMiddleware);

router
  .post("/", validate(createTaskSchema), tryCatch(createTask))
  .get("/", tryCatch(getAllTasks));
router.get("/stats", tryCatch(getTaskStats));
router.get("/:id", tryCatch(getTaskById));
router.put("/:id", validate(updateTaskSchema), tryCatch(updateTask));
router.delete("/:id", tryCatch(deleteTask));

export default router;
