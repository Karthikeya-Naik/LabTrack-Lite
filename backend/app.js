import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import assetRoutes from "./routes/assets.routes.js";
import ticketRoutes from "./routes/tickets.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";
import usersRoutes from "./routes/users.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LabTrack Lite API is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;