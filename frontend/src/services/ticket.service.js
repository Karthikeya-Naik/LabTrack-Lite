import api from "./api";

// Get all tickets
export const getTickets = async () => {
  const res = await api.get("/tickets");
  return res.data;
};

// Create ticket (Engineer)
export const createTicket = async (data) => {
  const res = await api.post("/tickets", data);
  return res.data;
};

// Update ticket status
export const updateTicketStatus = async (ticketId, status) => {
  const res = await api.put(`/tickets/${ticketId}/status`, { status });
  return res.data;
};

// Assign ticket (Admin)
export const assignTicket = async (ticketId, assignedToId) => {
  const res = await api.put(`/tickets/${ticketId}/assign`, { assignedToId });
  return res.data;
};

// Add comment
export const addComment = async (ticketId, content) => {
  const res = await api.post(`/tickets/${ticketId}/comments`, { content });
  return res.data;
};
