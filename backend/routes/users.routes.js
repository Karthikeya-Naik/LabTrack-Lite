import express from "express";
import {
  getUsers,
  deleteUser,
  toggleUserStatus
} from "../controllers/users.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", authenticate, authorizeRoles("ADMIN"), getUsers);

router.patch(
  "/:id/toggle",
  authenticate,
  authorizeRoles("ADMIN"),
  toggleUserStatus
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  deleteUser
);

export default router;
