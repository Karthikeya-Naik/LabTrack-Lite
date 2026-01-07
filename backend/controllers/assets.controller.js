import prisma from "../prisma/client.js";

export const createAsset = async (req, res) => {
  try {
    const { name, assetCode, location, status, qrCode, serialNumber } = req.body;

    if (!name || !assetCode || !location || !status || !qrCode) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const asset = await prisma.asset.create({
      data: {
        name,
        assetCode,
        serialNumber,
        location,
        status,
        qrCode,
        createdById: req.user.id,
      },
    });

    res.status(201).json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create asset" });
  }
};

export const getAssets = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const assets = await prisma.asset.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    res.json({
      page,
      limit,
      data: assets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch assets" });
  }
};

export const updateAsset = async (req, res) => {
  try {
    const { id } = req.params; 

    const asset = await prisma.asset.update({
      where: { id },
      data: req.body,
    });

    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update asset" });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.asset.delete({
      where: { id },
    });

    res.json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete asset" });
  }
};
