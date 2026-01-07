import { Link } from "react-router-dom";
import {
  PlusIcon,
  WrenchScrewdriverIcon,
  QrCodeIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export default function QuickActions({ role }) {
  const actions = {
    ADMIN: [
      {
        to: "/assets/new",
        label: "Add Asset",
        icon: PlusIcon,
        color: "bg-blue-500 hover:bg-blue-600",
        description: "Register new lab equipment",
      },
      {
        to: "/users/new",
        label: "Create User",
        icon: UserPlusIcon,
        color: "bg-purple-500 hover:bg-purple-600",
        description: "Add team member",
      },
      {
        to: "/assets",
        label: "Manage Assets",
        icon: WrenchScrewdriverIcon,
        color: "bg-green-500 hover:bg-green-600",
        description: "View all equipment",
      },
      {
        to: "/tickets",
        label: "View Tickets",
        icon: EyeIcon,
        color: "bg-orange-500 hover:bg-orange-600",
        description: "Monitor all issues",
      },
    ],
    ENGINEER: [
      {
        to: "/tickets/new",
        label: "Create Ticket",
        icon: PlusIcon,
        color: "bg-blue-500 hover:bg-blue-600",
        description: "Report equipment issue",
      },
      {
        to: "/tickets",
        label: "My Tickets",
        icon: EyeIcon,
        color: "bg-green-500 hover:bg-green-600",
        description: "View assigned tickets",
      },
      {
        to: "/assets",
        label: "Browse Assets",
        icon: QrCodeIcon,
        color: "bg-purple-500 hover:bg-purple-600",
        description: "View lab equipment",
      },
    ],
    TECHNICIAN: [
      {
        to: "/tickets",
        label: "Update Tickets",
        icon: WrenchScrewdriverIcon,
        color: "bg-blue-500 hover:bg-blue-600",
        description: "Fix reported issues",
      },
      {
        to: "/assets",
        label: "Scan QR Code",
        icon: QrCodeIcon,
        color: "bg-green-500 hover:bg-green-600",
        description: "Quick asset lookup",
      },
    ],
  };

  const commonActions = [
    {
      to: "/chatbot",
      label: "Ask Chatbot",
      icon: ChatBubbleLeftRightIcon,
      color: "bg-indigo-500 hover:bg-indigo-600",
      description: "Natural language queries",
    },
  ];

  const userActions = [...(actions[role] || []), ...commonActions];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        <span className="text-sm text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
          {userActions.length} actions available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {userActions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-5 border border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-start space-x-4">
              <div className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                  {action.label}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                Go to page
                <svg
                  className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}