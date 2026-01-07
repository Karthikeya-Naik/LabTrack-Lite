import prisma from "../prisma/client.js";

export const chatbotQuery = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const q = query.toLowerCase();

    if (q.includes("open tickets")) {
      const tickets = await prisma.ticket.findMany({
        where: { status: "OPEN" }
      });
      return res.json({ intent: "OPEN_TICKETS", data: tickets });
    }

    if (q.includes("high priority")) {
      const tickets = await prisma.ticket.findMany({
        where: { priority: "HIGH" }
      });
      return res.json({ intent: "HIGH_PRIORITY_TICKETS", data: tickets });
    }

    if (q.includes("assigned to me")) {
      const tickets = await prisma.ticket.findMany({
        where: { assignedToId: req.user.id }
      });
      return res.json({ intent: "MY_ASSIGNED_TICKETS", data: tickets });
    }

    if (q.includes("under maintenance")) {
      const assets = await prisma.asset.findMany({
        where: { status: "UNDER_MAINTENANCE" }
      });
      return res.json({
        intent: "ASSETS_UNDER_MAINTENANCE",
        data: assets
      });
    }

    if (q.includes("how many") && q.includes("open tickets")) {
      const count = await prisma.ticket.count({
        where: { status: "OPEN" }
      });
      return res.json({
        intent: "COUNT_OPEN_TICKETS",
        data: { count }
      });
    }

    return res.json({
      intent: "UNKNOWN",
      message: "Sorry, I couldn't understand your query."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Chatbot query failed" });
  }
};
