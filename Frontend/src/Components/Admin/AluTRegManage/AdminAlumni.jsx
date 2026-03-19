import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, CheckCircle, XCircle, Clock, Eye, Mail, Trash2, Search, Filter } from "lucide-react";
import "./AdminAlumni.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5003/api";

function AdminAlumni() {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStats();
    fetchRegistrations();
  }, [statusFilter, page]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/alumni/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError("Failed to fetch statistics");
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      params.append("page", page);
      
      const response = await axios.get(`${API_URL}/alumni?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setRegistrations(response.data.data);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (err) {
      setError("Failed to fetch registrations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/alumni/${id}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        fetchStats();
        fetchRegistrations();
        if (selectedRegistration && selectedRegistration._id === id) {
          setSelectedRegistration(response.data.data);
        }
      }
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_URL}/alumni/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        fetchStats();
        fetchRegistrations();
        if (selectedRegistration && selectedRegistration._id === id) {
          setShowDetails(false);
          setSelectedRegistration(null);
        }
      }
    } catch (err) {
      setError("Failed to delete registration");
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.idNumber.includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: "AA-badge-pending", icon: Clock },
      approved: { class: "AA-badge-approved", icon: CheckCircle },
      rejected: { class: "AA-badge-rejected", icon: XCircle }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`AA-status-badge ${badge.class}`}>
        <Icon size={14} />
        {status}
      </span>
    );
  };

  return (
    <div className="AA-container">
      <div className="AA-header">
        <h1><Users size={24} /> Alumni Registrations</h1>
        <p>Manage and review alumni registration requests</p>
      </div>

      <div className="AA-stats-grid">
        <div className="AA-stat-card">
          <span className="AA-stat-label">Total</span>
          <span className="AA-stat-value">{stats.total}</span>
        </div>
        <div className="AA-stat-card AA-stat-pending">
          <span className="AA-stat-label">Pending</span>
          <span className="AA-stat-value">{stats.pending}</span>
        </div>
        <div className="AA-stat-card AA-stat-approved">
          <span className="AA-stat-label">Approved</span>
          <span className="AA-stat-value">{stats.approved}</span>
        </div>
        <div className="AA-stat-card AA-stat-rejected">
          <span className="AA-stat-label">Rejected</span>
          <span className="AA-stat-value">{stats.rejected}</span>
        </div>
      </div>

      <div className="AA-controls">
        <div className="AA-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="AA-filter">
          <Filter size={18} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {error && <div className="AA-error">{error}</div>}

      {loading ? (
        <div className="AA-loading">Loading...</div>
      ) : (
        <>
          <div className="AA-table-container">
            <table className="AA-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID Number</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map(reg => (
                  <tr key={reg._id}>
                    <td>{reg.fullName}</td>
                    <td>{reg.idNumber}</td>
                    <td>{reg.email}</td>
                    <td>{reg.phone}</td>
                    <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                    <td>{getStatusBadge(reg.status)}</td>
                    <td className="AA-actions">
                      <button
                        className="AA-btn-view"
                        onClick={() => {
                          setSelectedRegistration(reg);
                          setShowDetails(true);
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="AA-btn-email"
                        onClick={() => window.location.href = `mailto:${reg.email}`}
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        className="AA-btn-delete"
                        onClick={() => handleDelete(reg._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="AA-pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`AA-page-btn ${p === page ? "AA-page-active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {showDetails && selectedRegistration && (
        <div className="AA-modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="AA-modal" onClick={e => e.stopPropagation()}>
            <div className="AA-modal-header">
              <h2>Registration Details</h2>
              <button className="AA-modal-close" onClick={() => setShowDetails(false)}>×</button>
            </div>
            
            <div className="AA-modal-body">
              <div className="AA-detail-grid">
                <div className="AA-detail-item">
                  <label>Full Name</label>
                  <p>{selectedRegistration.fullName}</p>
                </div>
                
                <div className="AA-detail-item">
                  <label>ID Number</label>
                  <p>{selectedRegistration.idNumber}</p>
                </div>
                
                <div className="AA-detail-item">
                  <label>Birthday</label>
                  <p>{new Date(selectedRegistration.birthday).toLocaleDateString()}</p>
                </div>
                
                <div className="AA-detail-item">
                  <label>Gender</label>
                  <p>{selectedRegistration.gender === "male" ? "Male" : "Female"}</p>
                </div>
                
                <div className="AA-detail-item">
                  <label>Email</label>
                  <p>{selectedRegistration.email}</p>
                </div>
                
                <div className="AA-detail-item">
                  <label>Phone</label>
                  <p>{selectedRegistration.phone}</p>
                </div>
                
                <div className="AA-detail-item AA-full-width">
                  <label>Address</label>
                  <p>{selectedRegistration.address}</p>
                </div>
                
                <div className="AA-detail-item">
                  <label>ID Photo</label>
                  <a 
                    href={`http://localhost:5003${selectedRegistration.idPhoto}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="AA-file-link"
                  >
                    View Photo
                  </a>
                </div>
                
                {selectedRegistration.cvFile && (
                  <div className="AA-detail-item">
                    <label>CV File</label>
                    <a 
                      href={`http://localhost:5003${selectedRegistration.cvFile}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="AA-file-link"
                    >
                      Download CV
                    </a>
                  </div>
                )}
                
                <div className="AA-detail-item">
                  <label>Status</label>
                  <div>{getStatusBadge(selectedRegistration.status)}</div>
                </div>
                
                <div className="AA-detail-item">
                  <label>Submitted</label>
                  <p>{new Date(selectedRegistration.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="AA-modal-footer">
              {selectedRegistration.status === "pending" && (
                <>
                  <button
                    className="AA-btn-approve"
                    onClick={() => handleStatusUpdate(selectedRegistration._id, "approved")}
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button
                    className="AA-btn-reject"
                    onClick={() => handleStatusUpdate(selectedRegistration._id, "rejected")}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </>
              )}
              <button
                className="AA-btn-close"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAlumni;