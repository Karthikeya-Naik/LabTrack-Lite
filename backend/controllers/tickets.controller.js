import prisma from "../prisma/client.js";

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

export const getTickets = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let whereClause = {};

    if (role === "ADMIN") {
      whereClause = {};
    }

    if (role === "ENGINEER") {
      whereClause = {
        OR: [
          { reportedById: userId },
          { assignedToId: userId }
        ]
      };
    }

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
