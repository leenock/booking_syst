"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import AddVisitorModal from "./components/AddVisitorModal";
import EditVisitorModal from "./components/EditVisitorModal";
import DeleteVisitorModal from "./components/DeleteVisitorModal";
import AuthService from "@/app/services/auth";
import Toast from "@/app/components/ui/Toast";

interface VisitorAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

type StatusFilter = "all" | "active" | "inactive";

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Fetch visitors
  const fetchVisitors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/visitor-accounts", {
        headers: {
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch visitors");
      }

      const data = await response.json();
      setVisitors(data);
    } catch (error) {
      console.error("Error fetching visitors:", error);
      setToast({
        message: "Failed to fetch visitors",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // Filter visitors based on search term and status
  const filteredVisitors = visitors.filter((visitor) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      visitor.firstName.toLowerCase().includes(searchLower) ||
      visitor.lastName.toLowerCase().includes(searchLower) ||
      visitor.email.toLowerCase().includes(searchLower) ||
      visitor.phone.includes(searchTerm);

    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "active" && visitor.isActive) ||
      (statusFilter === "inactive" && !visitor.isActive);

    return matchesSearch && matchesStatus;
  });

  // Handle visitor actions
  const handleEdit = (visitor: VisitorAccount) => {
    setSelectedVisitor(visitor);
    setIsEditModalOpen(true);
  };

  const handleDelete = (visitor: VisitorAccount) => {
    setSelectedVisitor(visitor);
    setIsDeleteModalOpen(true);
  };

  const handleVisitorAdded = () => {
    fetchVisitors();
  };

  const handleVisitorUpdated = () => {
    fetchVisitors();
  };

  const handleVisitorDeleted = () => {
    fetchVisitors();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Visitor Accounts</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Visitor
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search visitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20
                     appearance-none pr-10"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Visitors Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : filteredVisitors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No visitors found
                </td>
              </tr>
            ) : (
              filteredVisitors.map((visitor) => (
                <tr key={visitor.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {visitor.firstName} {visitor.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{visitor.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{visitor.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
                                  visitor.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                    >
                      {visitor.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(visitor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => handleEdit(visitor)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(visitor)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddVisitorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onVisitorAdded={handleVisitorAdded}
      />

      {selectedVisitor && (
        <>
          <EditVisitorModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            visitor={selectedVisitor}
            onVisitorUpdated={handleVisitorUpdated}
          />

          <DeleteVisitorModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            visitor={selectedVisitor}
            onVisitorDeleted={handleVisitorDeleted}
          />
        </>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
