import React, { useState } from 'react';
import {
  User, Phone, Mail, MapPin, Package, Weight, Clock, Calendar,
  CheckSquare, XSquare, Eye, Edit, Trash2, AlertTriangle
} from 'lucide-react';

// Helper Functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

const renderStatus = (status) => {
  const statusClasses = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Confirmed': 'bg-green-100 text-green-800',
    'Completed': 'bg-blue-100 text-blue-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Unknown': 'bg-gray-100 text-gray-800'
  };
  
  const statusClass = statusClasses[status] || statusClasses['Unknown'];
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
      {status || 'Unknown'}
    </span>
  );
};

// Example data for demonstration
const exampleRequests = [
  {
    id: '001',
    date: '2025-06-15T10:00:00.000Z',
    timeSlot: '10:00 AM - 12:00 PM',
    customer: {
      name: 'John Smith',
      phone: '555-123-4567',
      email: 'john@example.com'
    },
    address: {
      street: '123 Main St',
      city: 'Springfield',
      zip: '12345'
    },
    material: 'Electronics',
    estimatedWeight: '15kg',
    status: 'Pending'
  },
  {
    id: '002',
    date: '2025-06-16T14:00:00.000Z',
    timeSlot: '2:00 PM - 4:00 PM',
    customer: {
      name: 'Lisa Johnson',
      phone: '555-987-6543',
      email: 'lisa@example.com'
    },
    address: {
      street: '456 Oak Ave',
      city: 'Rivertown',
      zip: '67890'
    },
    material: 'Paper & Cardboard',
    estimatedWeight: '8kg',
    status: 'Confirmed'
  },
  {
    id: '003',
    date: '2025-06-14T09:00:00.000Z',
    timeSlot: '9:00 AM - 11:00 AM',
    customer: {
      name: 'Michael Chen',
      phone: '555-222-3333',
      email: 'michael@example.com'
    },
    address: {
      street: '789 Pine Rd',
      city: 'Hillside',
      zip: '54321'
    },
    material: 'Plastics',
    estimatedWeight: '10kg',
    status: 'Completed'
  }
];

const AdCheckReq = () => {
  const [requests, setRequests] = useState(exampleRequests);
  
  // Action handlers (frontend only, no backend calls)
  const handleApprove = (id) => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === id ? {...req, status: 'Confirmed'} : req
      )
    );
  };

  const handleReject = (id) => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === id ? {...req, status: 'Cancelled'} : req
      )
    );
  };

  const handleViewDetails = (id) => {
    alert(`View details for request ${id}`);
  };

  const handleEdit = (id) => {
    alert(`Edit request ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Delete request ${id}?`)) {
      setRequests(prevRequests => 
        prevRequests.filter(req => req.id !== id)
      );
    }
  };

  // Return empty state if no requests
  if (requests.length === 0) {
    return (
      <div className="p-4 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Pickup Requests</h2>
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <AlertTriangle size={24} className="text-yellow-500 mb-2" />
          <p className="text-gray-600">No requests found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Pickup Requests</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Calendar size={16} /> Date
                </span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Clock size={16} /> Time Slot
                </span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <User size={16} /> Customer
                </span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <MapPin size={16} /> Location
                </span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Package size={16} /> Material
                </span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Weight size={16} /> Est. Weight
                </span>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  {formatDate(req.date)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {req.timeSlot || 'N/A'}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{req.customer?.name || 'N/A'}</span>
                    {req.customer?.phone && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone size={12} /> {req.customer.phone}
                      </span>
                    )}
                    {req.customer?.email && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail size={12} /> {req.customer.email}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-900">
                    {req.address?.street || 'N/A'}
                    {req.address?.city && `, ${req.address.city}`}
                    {req.address?.zip && ` ${req.address.zip}`}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {req.material || 'N/A'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {req.estimatedWeight || 'N/A'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {renderStatus(req.status)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(req.id)}
                      className="p-1 rounded text-blue-600 hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    
                    {req.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="p-1 rounded text-green-600 hover:bg-green-50"
                          title="Approve Request"
                        >
                          <CheckSquare size={16} />
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="p-1 rounded text-red-600 hover:bg-red-50"
                          title="Reject Request"
                        >
                          <XSquare size={16} />
                        </button>
                      </>
                    )}
                    
                    {(req.status !== 'Completed' && req.status !== 'Cancelled') && (
                      <button
                        onClick={() => handleEdit(req.id)}
                        className="p-1 rounded text-purple-600 hover:bg-purple-50"
                        title="Edit Request"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    
                    {req.status !== 'Completed' && (
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="p-1 rounded text-gray-600 hover:bg-gray-50"
                        title="Delete Request"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdCheckReq;