import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";

const MyOrders = () => {
  const navigate = useNavigate();
  const [userOrders, setUserOrders] = useState([]);
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedEmail = localStorage.getItem('glass_user_email');
    if (!savedEmail) {
      navigate('/GlassOrder');
      return;
    }
    setLoggedInEmail(savedEmail);
    loadOrders(savedEmail);
  }, [navigate]);

  const loadOrders = (email) => {
    const orders = JSON.parse(localStorage.getItem('glass_orders') || '[]');
    const filteredOrders = orders.filter(order => 
      order.userInfo && order.userInfo.email && order.userInfo.email.toLowerCase() === email.toLowerCase()
    );
    setUserOrders(filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    setLoading(false);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'myorder-status-pending';
      case 'processing': return 'myorder-status-processing';
      case 'dispatched': return 'myorder-status-dispatched';
      case 'ontheway': return 'myorder-status-ontheway';
      case 'delivered': return 'myorder-status-delivered';
      default: return 'myorder-status-pending';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'dispatched': return 'Dispatched';
      case 'ontheway': return 'On The Way';
      case 'delivered': return 'Delivered';
      default: return 'Pending';
    }
  };

  const getStatusStep = (status, step) => {
    const steps = ['pending', 'processing', 'dispatched', 'ontheway', 'delivered'];
    const currentIndex = steps.indexOf(status);
    const stepIndex = steps.indexOf(step);
    return currentIndex >= stepIndex;
  };

  if (loading) {
    return (
      <div className="myorders-loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="myorders-container">
      <div className="myorders-header">
        <button className="myorders-back-btn" onClick={() => navigate('/GlassOrder')}>
          ← Back to Order
        </button>
        <h1>My Orders</h1>
        <p>Email: {loggedInEmail}</p>
      </div>

      {userOrders.length === 0 ? (
        <div className="myorders-empty">
          <div className="empty-icon">📦</div>
          <h2>No Orders Found</h2>
          <p>You haven't placed any orders yet with email: {loggedInEmail}</p>
          <button className="start-ordering-btn" onClick={() => navigate('/GlassOrder')}>
            Start Ordering
          </button>
        </div>
      ) : (
        <div className="myorders-list">
          {userOrders.map((order) => (
            <div key={order.id} className="myorder-card">
              <div className="myorder-card-header">
                <div className="myorder-ids">
                  <span className="myorder-orderid">Order ID: {order.id}</span>
                  <span className="myorder-billno">Bill No: {order.billNumber}</span>
                </div>
                <span className={getStatusBadgeClass(order.status)}>{getStatusText(order.status)}</span>
              </div>

              <div className="myorder-date">
                Placed on: {new Date(order.orderDate).toLocaleString()}
              </div>

              <div className="order-progress-tracker">
                <div className="progress-steps">
                  <div className={`progress-step ${getStatusStep(order.status, 'pending') ? 'active' : ''}`}>
                    <div className="step-circle">1</div>
                    <div className="step-label">Pending</div>
                  </div>
                  <div className={`progress-line ${getStatusStep(order.status, 'processing') ? 'active' : ''}`}></div>
                  <div className={`progress-step ${getStatusStep(order.status, 'processing') ? 'active' : ''}`}>
                    <div className="step-circle">2</div>
                    <div className="step-label">Processing</div>
                  </div>
                  <div className={`progress-line ${getStatusStep(order.status, 'dispatched') ? 'active' : ''}`}></div>
                  <div className={`progress-step ${getStatusStep(order.status, 'dispatched') ? 'active' : ''}`}>
                    <div className="step-circle">3</div>
                    <div className="step-label">Dispatched</div>
                  </div>
                  <div className={`progress-line ${getStatusStep(order.status, 'ontheway') ? 'active' : ''}`}></div>
                  <div className={`progress-step ${getStatusStep(order.status, 'ontheway') ? 'active' : ''}`}>
                    <div className="step-circle">4</div>
                    <div className="step-label">On The Way</div>
                  </div>
                  <div className={`progress-line ${getStatusStep(order.status, 'delivered') ? 'active' : ''}`}></div>
                  <div className={`progress-step ${getStatusStep(order.status, 'delivered') ? 'active' : ''}`}>
                    <div className="step-circle">5</div>
                    <div className="step-label">Delivered</div>
                  </div>
                </div>
              </div>

              <div className="myorder-items">
                <h3>Order Items</h3>
                <table className="myorder-items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Dimensions</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.glassType} - {item.size}</td>
                        <td>{item.widthFt}' x {item.heightFt}'</td>
                        <td>{item.quantity}</td>
                        <td>Rs {item.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="myorder-summary">
                <div className="summary-row">
                  <span>Glass Total:</span>
                  <span>Rs {order.totalGlassPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Transport Cost:</span>
                  <span>Rs {order.transportCost.toFixed(2)}</span>
                </div>
                {order.insuranceCost > 0 && (
                  <div className="summary-row">
                    <span>Insurance:</span>
                    <span>Rs {order.insuranceCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Grand Total:</span>
                  <span>Rs {order.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="myorder-delivery">
                <h3>Delivery Information</h3>
                <div className="delivery-info">
                  <p><strong>Method:</strong> {order.deliveryMethod === "pickup" ? "Self Pickup" : "Home Delivery"}</p>
                  {order.deliveryMethod === "pickup" ? (
                    <>
                      <p><strong>Pickup Location:</strong> ALUX Panadura - Alubomulla</p>
                      <p><strong>Pickup Date:</strong> {order.pickupDate}</p>
                      <p><strong>Pickup Time:</strong> {order.pickupTimeSlot}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Delivery Address:</strong> {order.selectedLocation?.address || "Manually entered"}</p>
                      <p><strong>Distance:</strong> {order.distance} km</p>
                      <p><strong>Delivery Date:</strong> {order.deliveryDate}</p>
                      <p><strong>Delivery Time:</strong> {order.deliveryTimeSlot}</p>
                      {order.urgentDelivery && <p><strong>Urgent Delivery:</strong> Yes (+25% fee)</p>}
                      {order.insurance && <p><strong>Insurance:</strong> Included</p>}
                    </>
                  )}
                </div>
              </div>

              {order.status === 'delivered' && (
                <div className="delivered-success-badge">
                  ✓ Order Delivered Successfully
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;