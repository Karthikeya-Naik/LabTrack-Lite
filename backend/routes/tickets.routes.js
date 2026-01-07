import express from "express";
import {
  createTicket,
  getTickets,
  updateTicketStatus,
  assignTicket,
  addComment
} from "../controllers/tickets.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Engineer → create ticket
router.post(
  "/",
  authenticate,
  authorizeRoles("ENGINEER"),
  createTicket
);

// All roles → view tickets
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "ENGINEER", "TECHNICIAN"),
  getTickets
);

// Engineer / Technician → update status
router.put(
  "/:id/status",
  authenticate,
  authorizeRoles("ENGINEER", "TECHNICIAN"),
  updateTicketStatus
);

// Admin → assign ticket
router.put(
  "/:id/assign",
  authenticate,
  authorizeRoles("ADMIN"),
  assignTicket
);

// Engineer / Technician → add comment
router.post(
  "/:id/comments",
  authenticate,
  authorizeRoles("ENGINEER", "TECHNICIAN"),
  addComment
);

export default router;
