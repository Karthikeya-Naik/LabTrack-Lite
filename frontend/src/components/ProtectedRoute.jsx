import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldExclamationIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Checking authentication...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100">
            <ShieldExclamationIcon className="h-10 w-10 text-red-600" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Restricted
            </h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page. This area requires{" "}
              <span className="font-semibold text-blue-600">
                {allowedRoles.join(" or ")}
              </span>{" "}
              privileges.
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
              <LockClosedIcon className="h-4 w-4" />
              Your role:{" "}
              <span className="font-medium text-gray-700">{user.role}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = "/dashboard"}
              className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}