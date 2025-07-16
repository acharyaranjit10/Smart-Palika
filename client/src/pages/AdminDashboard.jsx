import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiRefreshCw, FiTrendingUp, FiX } from 'react-icons/fi';
import ComplaintCard from '../components/ComplaintCard';
import StatusBadge from '../components/StatusBadge';
import ComplaintTimeline from '../components/ComplaintTimeline';
import { toast } from 'react-hot-toast';
import api from "../api/axios";

const AdminDashboard = ({ complaints, updateComplaintStatus }) => {
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });
  
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  
  // Calculate statistics
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => ['Submitted', 'Reviewed'].includes(c.status)).length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    avgResolution: 5.2,
  };

  // Filter complaints based on filters
  useEffect(() => {
    let result = [...complaints];
    
    if (filters.status) {
      result = result.filter(c => c.status === filters.status);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower) ||
        c.province.toLowerCase().includes(searchLower) ||
        c.municipality.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredComplaints(result);
  }, [complaints, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

const handleStatusUpdate = async () => {
  if (!newStatus || !selectedComplaint) {
    toast.error('Please select a new status');
    return;
  }

  setIsUpdating(true);

  try {
    const token = localStorage.getItem("token");

    // ✅ Correct ID field: selectedComplaint._id
    // await api.put(`/complaints/${selectedComplaint._id}/status`, { status: newStatus }, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    await updateComplaintStatus(selectedComplaint._id, newStatus);

    // ✅ Update local state (just for UI responsiveness)
    setSelectedComplaint(prev => ({
      ...prev,
      status: newStatus,
      statusHistory: [
        ...(prev.statusHistory || []),
        { status: newStatus, date: new Date().toISOString() }
      ]
    }));

    toast.success('Status updated successfully!');
  } catch (err) {
    console.error("Failed to update status:", err);
    toast.error("Error updating complaint status");
  } finally {
    setNewStatus('');
    setIsUpdating(false);
  }
};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-nepal-blue">Admin Dashboard</h1>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button 
            className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            onClick={() => {
              setFilters({ status: '', search: '' });
              setSelectedComplaint(null);
            }}
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 mb-1">Total Complaints</p>
          <p className="text-3xl font-bold text-nepal-blue">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 mb-1">Resolved</p>
          <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600 mb-1">Avg. Resolution (Days)</p>
          <div className="flex items-end">
            <p className="text-3xl font-bold text-purple-600">{stats.avgResolution}</p>
            <FiTrendingUp className="ml-2 text-green-500 w-6 h-6" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter Complaints</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Reviewed">Reviewed</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search complaints..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Complaint List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Complaints ({filteredComplaints.length})
          </h2>
          <div className="text-sm text-gray-500 flex items-center">
            <FiFilter className="mr-2" />
            <span>{filters.status || 'All Statuses'}</span>
          </div>
        </div>
        
        <div className="divide-y max-h-[600px] overflow-y-auto">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map(complaint => (
              <ComplaintCard 
               key={complaint._id || complaint.id}
                complaint={complaint} 
                onClick={() => setSelectedComplaint(complaint)}
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              {complaints.length === 0 
                ? "No complaints filed yet" 
                : "No complaints match your filters"}
            </div>
          )}
        </div>
      </div>

      {/* Complaint Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-70 transition-opacity"
            onClick={() => setSelectedComplaint(null)}
          />
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-start z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedComplaint.title}</h2>
                <div className="mt-2">
                  <StatusBadge status={selectedComplaint.status} />
                </div>
              </div>
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="text-gray-700 break-words whitespace-pre-wrap overflow-x-hidden">
                    {selectedComplaint.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Location</h3>
                    <p className="text-gray-700">
                      {selectedComplaint.ward}, {selectedComplaint.municipality}, {selectedComplaint.province}
                    </p>
                    {selectedComplaint.location?.lat && (
                      <p className="text-sm text-gray-500 mt-1">
                        Coordinates: {selectedComplaint.location.lat.toFixed(6)}, {selectedComplaint.location.lng.toFixed(6)}
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Status Timeline</h3>
                    <ComplaintTimeline statusHistory={selectedComplaint.statusHistory} />
                  </div>
                </div>
                
                <div>
                  {selectedComplaint.imageUrl && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Evidence</h3>
                      <img 
                        src={selectedComplaint.imageUrl} 
                        alt="Complaint evidence" 
                        className="rounded-lg border border-gray-200 max-h-48 w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Update Status</h3>
                <div className="flex flex-col gap-3">
                <select
      value={newStatus}
      onChange={(e) => setNewStatus(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent max-w-full"
    >
      <option value="">Select new status</option>
      <option value="Submitted">Submitted</option>
      <option value="Reviewed">Reviewed</option>
      <option value="In Progress">In Progress</option>
      <option value="Resolved">Resolved</option>
    </select>
    
                  
                  <button
                    onClick={handleStatusUpdate}
                    disabled={!newStatus || isUpdating}
                    className={`w-full py-2 px-4 rounded-lg font-medium ${
                      isUpdating 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-nepal-red hover:bg-red-700 text-white'
                    }`}
                  >
                    {isUpdating ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>
            </div>
            
          {selectedComplaint && (
  <div className="sticky bottom-0 bg-white p-4 border-t flex justify-between items-center">
    <div className="text-sm text-gray-500">
      Complaint ID: #{(selectedComplaint._id || selectedComplaint.id || 'UNKNOWN').toString().slice(-6)}
    </div>
    <div className="text-sm text-gray-500">
      Submitted:{" "}
      {selectedComplaint.date
        ? new Date(selectedComplaint.date).toLocaleDateString()
        : "Date not available"}
    </div>
  </div>
)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;