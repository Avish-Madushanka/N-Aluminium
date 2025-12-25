import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const UserDetails = () => {
  const location = useLocation();
  const userId = location.state?.userId;

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    if (!userId) {
      setError("User not found");
      setLoading(false);
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
        setUserDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) return <div className="section">Loading user details...</div>;
  if (error) return <div className="section" style={{ color: "red" }}>{error}</div>;

  return (
    <div className="section">
      <hr />
      <h2 className="title">YOUR DETAILS</h2>
      <p className="subtitle">Fill Your Details</p>

      <input
        className="input"
        value={`${userDetails.firstName} ${userDetails.lastName}`}
        readOnly
      />

      <input
        className="input"
        value={userDetails.mobile}
        readOnly
      />

      <input
        className="input"
        value={userDetails.email}
        readOnly
      />

      <div className="checkbox-container">
        <input type="checkbox" className="checkbox" />
        <label>I agree to the Terms and Conditions</label>
      </div>
    </div>
  );
};

export default UserDetails;
