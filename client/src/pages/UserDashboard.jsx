import React, { useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintTimeline from '../components/ComplaintTimeline';
import { toast } from 'react-hot-toast';
import StatusBadge from '../components/StatusBadge';

const UserDashboard = ({ complaints }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    
    // Special handling for "In Progress" status
    if (activeTab === 'progress') {
      return matchesSearch && complaint.status === 'In Progress';
    }
    
    return matchesSearch && complaint.status.toLowerCase() === activeTab.toLowerCase();
  });
  
  const statusCounts = {
    all: complaints.length,
    submitted: complaints.filter(c => c.status === 'Submitted').length,
    reviewed: complaints.filter(c => c.status === 'Reviewed').length,
    progress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  // Map button keys to display text
  const statusDisplayText = {
    all: 'All',
    submitted: 'Submitted',
    reviewed: 'Reviewed',
    progress: 'In Progress',
    resolved: 'Resolved'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-nepal-blue">Your Dashboard</h1>
        <div className="relative mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent w-64"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                activeTab === status 
                  ? 'border-nepal-red bg-red-50 text-nepal-red' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl font-bold">{count}</span>
              <span className="capitalize mt-1">{statusDisplayText[status]}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Complaints</h2>
          <div className="flex items-center text-gray-500">
            <FiFilter className="mr-2" />
            <span className="text-sm">{filteredComplaints.length} complaints</span>
          </div>
        </div>
        
        <div className="divide-y">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map(complaint => (
              <ComplaintCard key={complaint._id || complaint.id} complaint={complaint} onClick={() => setSelectedComplaint(complaint)} />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No complaints found. File a new complaint to get started.
            </div>
          )}
        </div>
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Darkened Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-70"
            onClick={() => setSelectedComplaint(null)}
          />
          
          {/* Modal Content */}
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

             
            </div>
            
            <div className="sticky bottom-0 bg-white p-4 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500">
               Complaint ID: #{(selectedComplaint._id || selectedComplaint.id || 'UNKNOWN').toString().slice(-6)}
              </div>
              <div className="text-sm text-gray-500">
                Submitted: {selectedComplaint.date ? new Date(selectedComplaint.date).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>
          {          /* Close button for the modal */}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;