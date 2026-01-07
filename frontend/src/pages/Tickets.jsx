import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  getTickets,
  createTicket,
  updateTicketStatus,
  addComment,
  assignTicket
} from "../services/ticket.service";
import { getUsers } from "../services/user.service";
import { getAssets } from "../services/asset.service";
import { useAuth } from "../context/AuthContext";

const STATUS_OPTIONS = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "CANCELLED"
];

export default function Tickets() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin assignment state
  const [selectedAssignee, setSelectedAssignee] = useState({});

  // Comment input per ticket
  const [commentText, setCommentText] = useState({});

  // Engineer create ticket form
  const [form, setForm] = useState({
    title: "",
    description: "",
    assetId: ""
  });

  useEffect(() => {
    fetchTickets();
    fetchAssets();
    if (user?.role === "ADMIN") {
      fetchUsers();
    }
  }, []);

  /* ---------------- FETCH DATA ---------------- */

  const fetchTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(
        data.filter(
          (u) => u.role === "ENGINEER" || u.role === "TECHNICIAN"
        )
      );
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await getAssets(1, 100);
      setAssets(res.data);
    } catch (err) {
      console.error("Failed to fetch assets", err);
    }
  };

  /* ---------------- ENGINEER ---------------- */

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await createTicket(form);
      setForm({ title: "", description: "", assetId: "" });
      fetchTickets();
    } catch (err) {
      alert("Failed to create ticket");
      console.error(err);
    }
  };

  /* ---------------- ADMIN ---------------- */

  const handleAssign = async (ticketId) => {
    const assigneeId = selectedAssignee[ticketId];
    if (!assigneeId) return;

    try {
      await assignTicket(ticketId, assigneeId);

      setSelectedAssignee((prev) => ({
        ...prev,
        [ticketId]: ""
      }));

      fetchTickets();
    } catch (err) {
      alert("Assignment failed");
      console.error(err);
    }
  };

  /* ---------------- ENGINEER / TECHNICIAN ---------------- */

  const handleStatusChange = async (id, status) => {
    try {
      await updateTicketStatus(id, status);
      fetchTickets();
    } catch (err) {
      alert("Status update failed");
      console.error(err);
    }
  };

  const handleAddComment = async (id) => {
    const content = commentText[id];
    if (!content) return;

    try {
      await addComment(id, content);

      setCommentText((prev) => ({
        ...prev,
        [id]: ""
      }));

      fetchTickets();
    } catch (err) {
      alert("Failed to add comment");
      console.error(err);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Tickets</h1>

      {/* ENGINEER: CREATE TICKET */}
      {user?.role === "ENGINEER" && (
        <form
          onSubmit={handleCreateTicket}
          className="bg-white p-4 rounded shadow mb-6 grid grid-cols-3 gap-4"
        >
          <input
            className="border p-2 rounded"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <select
            className="border p-2 rounded"
            value={form.assetId}
            onChange={(e) =>
              setForm({ ...form, assetId: e.target.value })
            }
            required
          >
            <option value="">Select Asset</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.assetCode})
              </option>
            ))}
          </select>

          <input
            className="border p-2 rounded col-span-3"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button
            type="submit"
            className="col-span-3 bg-blue-600 text-white py-2 rounded"
          >
            Create Ticket
          </button>
        </form>
      )}

      {/* TICKETS LIST */}
      {loading ? (
        <p>Loading tickets...</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white p-4 rounded shadow"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{ticket.title}</h2>
                <span className="text-sm text-gray-600">
                  {ticket.status}
                </span>
              </div>

              <p className="text-sm text-gray-700 mt-1">
                {ticket.description}
              </p>

              <p className="text-sm mt-2">
                Assigned To:{" "}
                <span className="font-medium">
                  {ticket.assignedTo
                    ? ticket.assignedTo.fullName ||
                      ticket.assignedTo.email
                    : "Not Assigned"}
                </span>
              </p>

              {/* ADMIN: ASSIGN */}
              {user?.role === "ADMIN" && (
                <div className="mt-3 flex items-center gap-2">
                  <select
                    className="border p-1 rounded text-sm"
                    value={selectedAssignee[ticket.id] || ""}
                    onChange={(e) =>
                      setSelectedAssignee({
                        ...selectedAssignee,
                        [ticket.id]: e.target.value
                      })
                    }
                  >
                    <option value="">Select assignee</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName || u.email} ({u.role})
                      </option>
                    ))}
                  </select>

                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                    disabled={!selectedAssignee[ticket.id]}
                    onClick={() => handleAssign(ticket.id)}
                  >
                    {ticket.assignedTo ? "Change" : "Assign"}
                  </button>
                </div>
              )}

              {/* ENGINEER / TECHNICIAN: STATUS */}
              {(user?.role === "ENGINEER" ||
                user?.role === "TECHNICIAN") && (
                <select
                  className="mt-3 border p-1 rounded text-sm"
                  value={ticket.status}
                  onChange={(e) =>
                    handleStatusChange(ticket.id, e.target.value)
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              )}

              {/* COMMENTS */}
              <div className="mt-4">
                <h4 className="text-sm font-medium">Comments</h4>

                <ul className="text-sm mt-1 space-y-1">
                  {ticket.comments.map((c) => (
                    <li key={c.id}>• {c.content}</li>
                  ))}
                </ul>

                {(user?.role === "ENGINEER" ||
                  user?.role === "TECHNICIAN") && (
                  <div className="mt-2 flex gap-2">
                    <input
                      className="flex-1 border p-2 rounded text-sm"
                      placeholder="Write a comment..."
                      value={commentText[ticket.id] || ""}
                      onChange={(e) =>
                        setCommentText({
                          ...commentText,
                          [ticket.id]: e.target.value
                        })
                      }
                    />
                    <button
                      className="bg-blue-600 text-white px-3 py-2 rounded text-sm disabled:opacity-50"
                      disabled={!commentText[ticket.id]}
                      onClick={() => handleAddComment(ticket.id)}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
