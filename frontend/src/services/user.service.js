import api from "./api";

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const createUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
};

export const toggleUserStatus = async (id) => {
  const res = await api.patch(`/users/${id}/toggle`);
  return res.data;
};
