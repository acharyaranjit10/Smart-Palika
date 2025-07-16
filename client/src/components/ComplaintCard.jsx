// src/components/ComplaintCard.jsx
import React from 'react';
import { FiClock, FiMapPin, FiAlertCircle } from 'react-icons/fi';
import StatusBadge from './StatusBadge';

const ComplaintCard = ({ complaint, onClick, isSelected }) => {
  return (
    <div 
      className={`p-4 cursor-pointer transition-all ${
        isSelected 
          ? 'bg-blue-50 border-l-4 border-nepal-blue' 
          : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-gray-800">{complaint.title}</h3>
        <StatusBadge status={complaint.status} />
      </div>
      
      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{complaint.description}</p>
      
      <div className="flex flex-wrap items-center mt-3 text-xs text-gray-500 gap-3">
        <div className="flex items-center">
          <FiClock className="mr-1" />
          <span>{new Date(complaint.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <FiMapPin className="mr-1" />
          <span>Ward {complaint.wardNo}, {complaint.municipality}</span>
        </div>
     {complaint.imageUrl && (
  <div className="flex items-center text-blue-500">
    <FiAlertCircle className="mr-1" />
    <span>Photo Attached</span>
  </div>
)}
      </div>
    </div>
  );
};

export default ComplaintCard;