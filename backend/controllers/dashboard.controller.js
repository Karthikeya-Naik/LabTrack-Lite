import prisma from "../prisma/client.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalAssets,
      openTickets,
      inProgressTickets,
      ticketStatus,
      assetStatus
    ] = await Promise.all([
      prisma.asset.count(),

      prisma.ticket.count({
        where: { status: "OPEN" }
      }),

      prisma.ticket.count({
        where: { status: "IN_PROGRESS" }
      }),

      prisma.ticket.groupBy({
        by: ["status"],
        _count: { status: true }
      }),

      prisma.asset.groupBy({
        by: ["status"],
        _count: { status: true }
      })
    ]);

    res.json({
      stats: {
        assets: totalAssets,
        openTickets,
        inProgress: inProgressTickets
      },
      ticketChart: ticketStatus.map(t => ({
        status: t.status,
        count: t._count.status
      })),
      assetChart: assetStatus.map(a => ({
        status: a.status,
        count: a._count.status
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard load failed" });
  }
};
