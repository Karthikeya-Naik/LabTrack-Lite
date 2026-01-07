import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HomeIcon,
  UsersIcon,
  CubeIcon,
  TicketIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
      roles: ["ADMIN", "ENGINEER", "TECHNICIAN"],
    },
    {
      name: "Assets",
      href: "/assets",
      icon: CubeIcon,
      roles: ["ADMIN", "ENGINEER", "TECHNICIAN"],
    },
    {
      name: "Tickets",
      href: "/tickets",
      icon: TicketIcon,
      roles: ["ADMIN", "ENGINEER", "TECHNICIAN"],
    },
    {
      name: "Users",
      href: "/users",
      icon: UsersIcon,
      roles: ["ADMIN"],
    },
    {
      name: "Chatbot",
      href: "/chatbot",
      icon: ChatBubbleLeftRightIcon,
      roles: ["ADMIN", "ENGINEER", "TECHNICIAN"],
    },
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN": return "bg-blue-700";
      case "ENGINEER": return "bg-blue-600";
      case "TECHNICIAN": return "bg-blue-500";
      default: return "bg-blue-800";
    }
  };

  const filteredNav = navigation.filter((item) =>
    item.roles.includes(user?.role)
  );

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl z-40">
      {/* Logo/Header */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-md">
            <span className="text-blue-600 font-bold text-lg">LT</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">LabTrack Lite</h1>
            <p className="text-sm text-blue-200">Asset Management</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div className={`h-10 w-10 rounded-full ${getRoleColor(user?.role)} flex items-center justify-center shadow-md`}>
            <span className="text-white font-semibold text-sm">
              {user?.fullName?.charAt(0) || user?.email?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.fullName || user?.email}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(user?.role)} bg-opacity-30 border border-blue-500`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {filteredNav.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-white text-blue-700 shadow-md"
                  : "text-blue-100 hover:bg-blue-700 hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-blue-700' : ''}`} />
              <span className={`ml-3 text-sm font-medium ${active ? 'text-blue-800' : ''}`}>
                {item.name}
              </span>
              
              {/* Active indicator */}
              {active && (
                <div className="ml-auto h-2 w-2 rounded-full bg-blue-500"></div>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}