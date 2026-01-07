import express from "express";
import {
  createAsset,
  getAssets,
  updateAsset,
  deleteAsset,
} from "../controllers/assets.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("ADMIN"), createAsset);
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateAsset);
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteAsset);

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "ENGINEER", "TECHNICIAN"),
  getAssets
);

export default router;
