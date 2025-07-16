// src/components/ComplaintTimeline.jsx
import React from 'react';
import { 
  FiCheckCircle, 
  FiClock,
  FiAlertCircle,
  FiThumbsUp,
  FiRotateCw
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const statusIcons = {
  Submitted: <FiAlertCircle className="w-4 h-4" />,
  Reviewed: <FiRotateCw className="w-4 h-4" />,
  'In Progress': <FiClock className="w-4 h-4" />,
  Resolved: <FiThumbsUp className="w-4 h-4" />
};

const statusColors = {
  Submitted: 'bg-blue-100 text-blue-800',
  Reviewed: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-purple-100 text-purple-800',
  Resolved: 'bg-green-100 text-green-800'
};

const ComplaintTimeline = ({ statusHistory }) => {
  const statusOrder = ['Submitted', 'Reviewed', 'In Progress', 'Resolved'];
  
  // Get the current status index
  const currentStatusIndex = statusHistory?.length > 0 
    ? statusOrder.indexOf(statusHistory[statusHistory.length - 1].status)
    : 0;

  return (
    <div className="relative pl-8">
      {/* Vertical progress line */}
      <div className="absolute left-5 top-2 h-full w-0.5 bg-gray-200">
        <motion.div 
          className="absolute top-0 left-0 w-0.5 bg-nepal-blue"
          initial={{ height: 0 }}
          animate={{ 
            height: `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%` 
          }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {statusOrder.map((status, index) => {
        const statusItemList = statusHistory?.filter(item => item.status === status);
const statusItem = statusItemList?.[statusItemList.length - 1]; // last matching status update
        const isCompleted = index <= currentStatusIndex;
        const isCurrent = index === currentStatusIndex;
        
        return (
          <motion.div 
            key={status}
            className="relative pb-8 last:pb-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start">
              {/* Status indicator */}
              <div className={`absolute left-0 flex items-center justify-center w-10 h-10 rounded-full ${isCompleted ? statusColors[status] : 'bg-gray-100'} border-4 border-white z-1`}>
                {isCompleted ? (
                  <div className="flex items-center justify-center">
                    {statusIcons[status] || <FiCheckCircle className="w-5 h-5" />}
                  </div>
                ) : (
                  <span className="font-medium text-gray-500">{index + 1}</span>
                )}
              </div>
              
              {/* Status content */}
              <div className={`ml-6 p-4 rounded-lg ${isCurrent ? 'bg-blue-50 border-l-4 border-nepal-blue' : ''}`}>
                <div className="flex items-center gap-2">
                  <h3 className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                    {status}
                  </h3>
                  {isCurrent && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-nepal-red text-white">
                      Current
                    </span>
                  )}
                </div>
                
                {statusItem && (
                  <div className="mt-1">
                    <p className="text-sm text-gray-500">
                      {new Date(statusItem.date).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {isCurrent && status === 'Resolved' && (
                      <p className="mt-2 text-sm text-green-600 flex items-center">
                        <FiThumbsUp className="mr-1" />
                        This complaint has been successfully resolved
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ComplaintTimeline;