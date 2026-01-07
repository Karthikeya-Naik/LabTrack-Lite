import api from "./api";

export const getTickets = async () => {
  const res = await api.get("/tickets");
  return res.data;
};

export const createTicket = async (data) => {
  const res = await api.post("/tickets", data);
  return res.data;
};

export const updateTicketStatus = async (ticketId, status) => {
  const res = await api.put(`/tickets/${ticketId}/status`, { status });
  return res.data;
};

export const assignTicket = async (ticketId, assignedToId) => {
  const res = await api.put(`/tickets/${ticketId}/assign`, { assignedToId });
  return res.data;
};

export const addComment = async (ticketId, content) => {
  const res = await api.post(`/tickets/${ticketId}/comments`, { content });
  return res.data;
};
