import api from "./api";

export const sendChatQuery = async (query) => {
  const res = await api.post("/chatbot/query", { query });
  return res.data;
};
