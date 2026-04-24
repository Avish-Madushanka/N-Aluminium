import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, CheckCircle, XCircle, Clock, Eye, Mail, Trash2, Search, Filter, FileText, Image as ImageIcon, Download } from "lucide-react";
import "./AdminAlumni.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5003/api";

function AdminAlumni() {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState(null);
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
      pending: { class: "AA-badge-pending", icon: Clock, label: "Pending" },
      approved: { class: "AA-badge-approved", icon: CheckCircle, label: "Approved" },
      rejected: { class: "AA-badge-rejected", icon: XCircle, label: "Rejected" }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`AA-status-badge ${badge.class}`}>
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="AA-page">
      <div className="AA-header">
        <h2 className="AA-title">Alumni Registrations</h2>
      </div>

      {error && (
        <div className="AA-error-message">
          <div className="AA-error-content">
            <span className="AA-error-icon">!</span>
            <span>{error}</span>
          </div>
          <button type="button" className="AA-error-close" onClick={() => setError('')}>×</button>
        </div>
      )}

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
                    <td className="AA-nameCell" onClick={() => setSelectedRegistration(reg)}>{reg.fullName}</td>
                    <td>{reg.idNumber}</td>
                    <td>{reg.email}</td>
                    <td>{reg.phone}</td>
                    <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                    <td>{getStatusBadge(reg.status)}</td>
                    <td className="AA-actions">
                      <button
                        className="AA-btn-view"
                        onClick={() => setSelectedRegistration(reg)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="AA-btn-email"
                        onClick={() => window.location.href = `mailto:${reg.email}`}
                        title="Send Email"
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        className="AA-btn-delete"
                        onClick={() => handleDelete(reg._id)}
                        title="Delete"
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

      {selectedRegistration && (
        <div className="AA-modal-overlay" onClick={() => setSelectedRegistration(null)}>
          <div className="AA-modal" onClick={e => e.stopPropagation()}>
            <div className="AA-modal-header">
              <h2>Registration Details</h2>
              <button className="AA-modal-close" onClick={() => setSelectedRegistration(null)}>×</button>
            </div>
            
            <div className="AA-modal-body">
              <div className="AA-twoColumn">
                <div className="AA-leftColumn">
                  <div className="AA-card">
                    <h3 className="AA-sectionTitle">
                      <Users size={18} /> Personal Information
                    </h3>
                    <div className="AA-fields">
                      <div className="AA-fieldGroup">
                        <label className="AA-label">Full Name</label>
                        <input type="text" className="AA-input" value={selectedRegistration.fullName} readOnly />
                      </div>

                      <div className="AA-fieldGroup">
                        <label className="AA-label">ID Number</label>
                        <input type="text" className="AA-input" value={selectedRegistration.idNumber} readOnly />
                      </div>

                      <div className="AA-row">
                        <div className="AA-fieldGroup">
                          <label className="AA-label">Birthday</label>
                          <input type="text" className="AA-input" value={new Date(selectedRegistration.birthday).toLocaleDateString()} readOnly />
                        </div>

                        <div className="AA-fieldGroup">
                          <label className="AA-label">Gender</label>
                          <input type="text" className="AA-input" value={selectedRegistration.gender === "male" ? "Male" : "Female"} readOnly />
                        </div>
                      </div>

                      <div className="AA-fieldGroup">
                        <label className="AA-label">Email</label>
                        <input type="email" className="AA-input" value={selectedRegistration.email} readOnly />
                      </div>

                      <div className="AA-fieldGroup">
                        <label className="AA-label">Phone</label>
                        <input type="text" className="AA-input" value={selectedRegistration.phone} readOnly />
                      </div>

                      <div className="AA-fieldGroup">
                        <label className="AA-label">Address</label>
                        <textarea className="AA-textarea" value={selectedRegistration.address} readOnly rows="3" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="AA-rightColumn">
                  <div className="AA-card">
                    <h3 className="AA-sectionTitle">
                      <FileText size={18} /> Documents & Status
                    </h3>
                    <div className="AA-fields">
                      <div className="AA-fieldGroup">
                        <label className="AA-label">ID Photo</label>
                        <div className="AA-imageUpload">
                          {selectedRegistration.idPhoto ? (
                            <div className="AA-imagePreview">
                              <img src={`http://localhost:5003${selectedRegistration.idPhoto}`} alt="ID Photo" />
                              <a 
                                href={`http://localhost:5003${selectedRegistration.idPhoto}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="AA-fileLink"
                              >
                                <ImageIcon size={14} /> View Full Size
                              </a>
                            </div>
                          ) : (
                            <div className="AA-uploadPlaceholder">
                              <span className="AA-uploadIcon">📄</span>
                              <span>No ID photo uploaded</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedRegistration.cvFile && (
                        <div className="AA-fieldGroup">
                          <label className="AA-label">CV / Resume</label>
                          <a 
                            href={`http://localhost:5003${selectedRegistration.cvFile}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="AA-fileLink AA-downloadBtn"
                          >
                            <Download size={14} /> Download CV
                          </a>
                        </div>
                      )}

                      <div className="AA-fieldGroup">
                        <label className="AA-label">Registration Status</label>
                        <div className="AA-statusOptions">
                          <div 
                            className={`AA-statusOption ${selectedRegistration.status === 'pending' ? 'AA-statusActive' : ''}`}
                            onClick={() => handleStatusUpdate(selectedRegistration._id, "pending")}
                          >
                            <Clock size={16} />
                            <span>Pending</span>
                            {selectedRegistration.status === 'pending' && <span className="AA-statusCheck">✓</span>}
                          </div>
                          <div 
                            className={`AA-statusOption ${selectedRegistration.status === 'approved' ? 'AA-statusActive' : ''}`}
                            onClick={() => handleStatusUpdate(selectedRegistration._id, "approved")}
                          >
                            <CheckCircle size={16} />
                            <span>Approved</span>
                            {selectedRegistration.status === 'approved' && <span className="AA-statusCheck">✓</span>}
                          </div>
                          <div 
                            className={`AA-statusOption ${selectedRegistration.status === 'rejected' ? 'AA-statusActive' : ''}`}
                            onClick={() => handleStatusUpdate(selectedRegistration._id, "rejected")}
                          >
                            <XCircle size={16} />
                            <span>Rejected</span>
                            {selectedRegistration.status === 'rejected' && <span className="AA-statusCheck">✓</span>}
                          </div>
                        </div>
                      </div>

                      <div className="AA-fieldGroup">
                        <label className="AA-label">Submitted On</label>
                        <input type="text" className="AA-input" value={new Date(selectedRegistration.createdAt).toLocaleString()} readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="AA-modal-footer">
              <button className="AA-cancel" onClick={() => setSelectedRegistration(null)}>
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