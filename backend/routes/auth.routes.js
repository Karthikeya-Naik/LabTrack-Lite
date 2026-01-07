import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post(
  "/register",
  authenticate,
  authorizeRoles("ADMIN"),
  register
);

export default router;
