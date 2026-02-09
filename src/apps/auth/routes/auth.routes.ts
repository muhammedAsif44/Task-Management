import { Router } from "express";
import {
  validate,
  registerSchema,
  loginSchema,
} from "../validation/auth.validation";
import tryCatch from "../../../utils/tryCatch";
import { login, refreshToken, register } from "../controller/auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), tryCatch(register));
router.post("/login", validate(loginSchema), tryCatch(login));
router.post("/refresh-token", tryCatch(refreshToken));

export default router;
