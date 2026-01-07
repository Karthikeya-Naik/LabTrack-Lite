import api from "./api";

export const getAssets = async (page = 1, limit = 5) => {
  const res = await api.get(`/assets?page=${page}&limit=${limit}`);
  return res.data;
};

export const createAsset = async (assetData) => {
  const res = await api.post("/assets", assetData);
  return res.data;
};
