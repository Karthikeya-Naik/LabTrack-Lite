import prisma from "../prisma/client.js";

/**
 * CREATE Ticket
 * Role: Engineer
 */
export const createTicket = async (req, res) => {
  try {
    const { title, description, assetId, priority } = req.body;

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        assetId,
        priority: priority || "MEDIUM",
        reportedById: req.user.id
      }
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

/**
 * GET Tickets
 * Role-based visibility
 * ADMIN       → all tickets
 * ENGINEER    → reported by OR assigned to
 * TECHNICIAN  → assigned to only
 */
export const getTickets = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let whereClause = {};

    // ADMIN → all tickets
    if (role === "ADMIN") {
      whereClause = {};
    }

    // ENGINEER → tickets reported by OR assigned to
    if (role === "ENGINEER") {
      whereClause = {
        OR: [
          { reportedById: userId },
          { assignedToId: userId }
        ]
      };
    }

    // TECHNICIAN → only assigned tickets
    if (role === "TECHNICIAN") {
      whereClause = {
        assignedToId: userId
      };
    }

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        asset: true,
        reportedBy: true,
        assignedTo: true,
        comments: {
          include: { user: true },
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

/**
 * UPDATE Ticket Status
 * Role: Engineer, Technician
 */
export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticketId = req.params.id;

    const allowedStatus = [
      "OPEN",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
      "CANCELLED"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid ticket status" });
    }

    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status }
    });

    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update ticket status" });
  }
};

/**
 * ASSIGN Ticket
 * Role: Admin
 */
export const assignTicket = async (req, res) => {
  try {
    const { assignedToId } = req.body;
    const ticketId = req.params.id;

    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { assignedToId }
    });

    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to assign ticket" });
  }
};

/**
 * ADD Comment
 * Role: Engineer, Technician
 */
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const ticketId = req.params.id;

    const comment = await prisma.comment.create({
      data: {
        content,
        ticketId,
        userId: req.user.id
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};
