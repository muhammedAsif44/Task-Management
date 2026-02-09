import { Router } from "express";
import {
  validate,
  createProjectSchema,
} from "../validation/project.validation";
import tryCatch from "../../../utils/tryCatch";
import {
  createProject,
  getProjects,
  getProject,
} from "../controller/project.controller";
import protectMiddleware from "../../../middlewares/protectMiddleware";

const router = Router();
router.use(protectMiddleware);
router
  .post("/", validate(createProjectSchema), tryCatch(createProject))
  .get("/", tryCatch(getProjects));
// router.get('/', tryCatch(getProjects));
router.get("/:id", tryCatch(getProject));

export default router;
