import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getAssets, createAsset } from "../services/asset.service";
import { useAuth } from "../context/AuthContext";
import { PlusIcon, QrCodeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Status badge styles
const STATUS_STYLE = {
  ACTIVE: "bg-green-100 text-green-800 border border-green-200",
  UNDER_MAINTENANCE: "bg-amber-100 text-amber-800 border border-amber-200",
  DAMAGED: "bg-red-100 text-red-800 border border-red-200",
  DECOMMISSIONED: "bg-gray-100 text-gray-800 border border-gray-300",
};

export default function Assets() {
  const { user } = useAuth();

  // Data & UI state
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const LIMIT = 10;

  // Admin create form
  const [form, setForm] = useState({
    name: "",
    assetCode: "",
    location: "",
    status: "ACTIVE",
    qrCode: "",
  });

  // Fetch assets
  useEffect(() => {
  fetchAssets();
}, [page]);



  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await getAssets(page, LIMIT);
      setAssets(data.data);
    } catch (e) {
      console.error("Failed to fetch assets");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAsset(form);
      setForm({
        name: "",
        assetCode: "",
        location: "",
        status: "ACTIVE",
        qrCode: "",
      });
      setShowForm(false);
      fetchAssets();
    } catch (e) {
      alert("Failed to create asset");
    }
  };

  return (
    <Layout>
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="text-gray-600 text-sm">Manage lab equipment and inventory</p>
        </div>
        
        {user?.role === "ADMIN" && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
            aria-label="Add new asset"
          >
            <PlusIcon className="h-5 w-5" />
            Add Asset
          </button>
        )}
      </div>

      {/* Add Asset Modal/Form */}
      {showForm && user?.role === "ADMIN" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Asset</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close form"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                    placeholder="e.g., 3D Printer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asset Code *
                  </label>
                  <input
                    type="text"
                    value={form.assetCode}
                    onChange={(e) => setForm({ ...form, assetCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                    placeholder="e.g., ASSET-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                    placeholder="e.g., Lab A, Rack 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    QR Code *
                  </label>
                  <input
                    type="text"
                    value={form.qrCode}
                    onChange={(e) => setForm({ ...form, qrCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                    placeholder="Enter QR code data"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                    <option value="DAMAGED">Damaged</option>
                    <option value="DECOMMISSIONED">Decommissioned</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Create Asset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assets Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Code</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Location</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">QR Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-2 text-gray-500">Loading assets...</p>
                    </div>
                  </td>
                </tr>
              ) : assets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <CubeIcon className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">No assets found</p>
                      {user?.role === "ADMIN" && (
                        <button
                          onClick={() => setShowForm(true)}
                          className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Add your first asset
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{asset.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {asset.assetCode}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{asset.location}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[asset.status]}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
                        {asset.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <QrCodeIcon className="h-4 w-4 text-gray-400" />
                        <code className="text-sm text-gray-600 font-mono">
                          {asset.qrCode.length > 20 ? `${asset.qrCode.substring(0, 20)}...` : asset.qrCode}
                        </code>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {assets.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {assets.length} assets
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
              Page {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={assets.length < LIMIT}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}