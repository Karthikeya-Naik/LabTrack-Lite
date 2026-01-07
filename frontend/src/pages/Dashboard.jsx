import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend,
  PieChart,
  Pie
} from "recharts";
import {
  CubeIcon,
  TicketIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const COLORS = {
  OPEN: "#f59e0b", // Amber
  IN_PROGRESS: "#3b82f6", // Blue
  RESOLVED: "#10b981", // Emerald
  CLOSED: "#6b7280", // Gray
  CANCELLED: "#ef4444", // Red
  ACTIVE: "#10b981", // Emerald
  UNDER_MAINTENANCE: "#f97316", // Orange
  DAMAGED: "#ef4444", // Red
  DECOMMISSIONED: "#374151", // Gray-700
};
export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    assets: 0,
    openTickets: 0,
    inProgress: 0,
    totalUsers: 0,
    assetChange: 0,
    ticketChange: 0,
  });
  const [ticketChart, setTicketChart] = useState([]);
  const [assetChart, setAssetChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data.stats);
      setTicketChart(res.data.ticketChart);
      setAssetChart(res.data.assetChart);
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header with Welcome */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.fullName?.split(' ')[0] || user?.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Here's what's happening with your lab assets.
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            {user?.role} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Assets"
          value={stats.assets}
          change={stats.assetChange}
          icon={CubeIcon}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets}
          change={stats.ticketChange}
          icon={TicketIcon}
          color={stats.openTickets > 5 ? "red" : "amber"}
          loading={loading}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={ClockIcon}
          color="indigo"
          loading={loading}
        />
        
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tickets by Status Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Tickets by Status</h2>
              <p className="text-sm text-gray-500">Distribution of ticket statuses</p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="px-2 py-1 rounded bg-blue-50 text-blue-700">Total: {stats.openTickets + stats.inProgress}</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketChart} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="status" 
                  tick={{ fill: '#6b7280' }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [value, 'Tickets']}
                />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                >
                  {ticketChart.map((entry, index) => (
                    <Cell key={index} fill={COLORS[entry.status]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            {ticketChart.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="h-3 w-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[item.status] }}
                />
                <span className="text-sm text-gray-600">{item.status.replace('_', ' ')}</span>
                <span className="ml-2 text-sm font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assets by Status Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Assets by Status</h2>
              <p className="text-sm text-gray-500">Current asset distribution</p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700">Active: {stats.assets}</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {assetChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.status]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Assets']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {assetChart.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div 
                    className="h-3 w-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[item.status] }}
                  />
                  <span className="text-sm text-gray-600">{item.status.replace('_', ' ')}</span>
                </div>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}