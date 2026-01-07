import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Tickets from "./pages/Tickets";
import Chatbot from "./pages/Chatbot";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Users />
          </ProtectedRoute>
        }
      />
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/assets"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "ENGINEER", "TECHNICIAN"]}>
            <Assets />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tickets"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "ENGINEER", "TECHNICIAN"]}>
            <Tickets />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
