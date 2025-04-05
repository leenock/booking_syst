"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Loader2 } from "lucide-react";
import AddRoomModal from "./components/AddRoomModal";
import EditRoomModal from "./components/EditRoomModal";
import DeleteRoomModal from "./components/DeleteRoomModal";

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  price: number;
  capacity: number;
  status: "AVAILABLE" | "MAINTENANCE";
  description: string;
  amenities: string[];
  images: string[];
  createdAt: string;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch rooms data
  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/rooms', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const result = await response.json();
      if (result.success) {
        setRooms(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch rooms');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRooms([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = (room: Room) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedRoom(null);
  };

  const handleRoomAdded = () => {
    fetchRooms();
    handleModalClose();
  };

  const handleRoomUpdated = () => {
    fetchRooms();
    handleModalClose();
  };

  const handleRoomDeleted = () => {
    fetchRooms();
    handleModalClose();
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || room.status === filterStatus;
    const matchesType = filterType === "all" || room.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchRooms}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Rooms</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your hotel rooms and their availability
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   transition-all duration-200 focus:outline-none focus:ring-2 
                   focus:ring-blue-500/20 font-medium cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Room
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
                       appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236B7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M10%203a1%201%200%2001.707.293l3%203a1%201%200%2001-1.414%201.414L10%205.414%207.707%207.707a1%201%200%2001-1.414-1.414l3-3A1%201%200%200110%203zm-3.707%209.293a1%201%200%20011.414%200L10%2014.586l2.293-2.293a1%201%200%20011.414%201.414l-3%203a1%201%200%2001-1.414%200l-3-3a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]"
            >
              <option value="all">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200
                       appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236B7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M10%203a1%201%200%2001.707.293l3%203a1%201%200%2001-1.414%201.414L10%205.414%207.707%207.707a1%201%200%2001-1.414-1.414l3-3A1%201%200%200110%203zm-3.707%209.293a1%201%200%20011.414%200L10%2014.586l2.293-2.293a1%201%200%20011.414%201.414l-3%203a1%201%200%2001-1.414%200l-3-3a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')]"
            >
              <option value="all">All Types</option>
              <option value="STANDARD">Standard</option>
              <option value="DELUXE">Deluxe</option>
              <option value="SUITE">Suite</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amenities
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {room.roomNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Ksh {room.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {room.capacity} persons
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        room.status === "AVAILABLE"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(room)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(room)}
                        className="text-red-600 hover:text-red-900 cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddRoomModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onRoomAdded={handleRoomAdded}
        />
      )}

      {isEditModalOpen && selectedRoom && (
        <EditRoomModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          onRoomUpdated={handleRoomUpdated}
          room={selectedRoom}
        />
      )}

      {isDeleteModalOpen && selectedRoom && (
        <DeleteRoomModal
          isOpen={isDeleteModalOpen}
          onClose={handleModalClose}
          onRoomDeleted={handleRoomDeleted}
          room={selectedRoom}
        />
      )}
    </div>
  );
}