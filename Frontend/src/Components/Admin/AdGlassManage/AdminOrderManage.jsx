import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import "./AdminOrderManage.css";

const AdminOrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('glass_orders') || '[]');
    setOrders(storedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'order-status-pending';
      case 'processing': return 'order-status-processing';
      case 'dispatched': return 'order-status-dispatched';
      case 'ontheway': return 'order-status-ontheway';
      case 'delivered': return 'order-status-delivered';
      default: return 'order-status-pending';
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

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = {
          ...order,
          status: newStatus,
          orderStatusHistory: [
            ...order.orderStatusHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note: statusNote || `Order status updated to ${newStatus}`
            }
          ]
        };
        return updatedOrder;
      }
      return order;
    });
    
    localStorage.setItem('glass_orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    toast.success(`Order status updated to ${getStatusText(newStatus)}`);
    setStatusNote("");
    
    if (selectedOrder && selectedOrder.id === orderId) {
      const updatedSelected = updatedOrders.find(o => o.id === orderId);
      setSelectedOrder(updatedSelected);
    }
  };

  const deleteOrder = () => {
    if (!orderToDelete) return;
    
    const updatedOrders = orders.filter(order => order.id !== orderToDelete.id);
    localStorage.setItem('glass_orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    toast.success(`Order ${orderToDelete.id} deleted successfully`);
    setShowDeleteConfirm(false);
    setOrderToDelete(null);
    
    if (selectedOrder && selectedOrder.id === orderToDelete.id) {
      setShowOrderModal(false);
      setSelectedOrder(null);
    }
  };

  const getFilteredOrders = () => {
    if (filterStatus === "all") return orders;
    return orders.filter(order => order.status === filterStatus);
  };

  const getOrderStatistics = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const dispatched = orders.filter(o => o.status === 'dispatched').length;
    const ontheway = orders.filter(o => o.status === 'ontheway').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    
    return { total, pending, processing, dispatched, ontheway, delivered };
  };

  const stats = getOrderStatistics();

  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="order-modal-overlay">
        <div className="order-modal">
          <div className="order-modal-header">
            <h2>Order Details - {order.id}</h2>
            <button className="order-modal-close" onClick={onClose}>×</button>
          </div>
          <div className="order-modal-body">
            <div className="order-info-section">
              <h3>Order Information</h3>
              <div className="order-info-grid">
                <div><strong>Bill Number:</strong> {order.billNumber}</div>
                <div><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</div>
                <div><strong>Status:</strong> <span className={getStatusBadgeClass(order.status)}>{getStatusText(order.status)}</span></div>
                <div><strong>Payment Method:</strong> {order.paymentMethod === "card" ? "Credit/Debit Card" : order.paymentMethod === "bank" ? "Bank Transfer" : order.paymentMethod === "cash" ? "Cash on Delivery" : order.paymentMethod === "paypal" ? "PayPal" : "Mobile Payment"}</div>
                <div><strong>Delivery Method:</strong> {order.deliveryMethod === "pickup" ? "Self Pickup" : "Home Delivery"}</div>
                <div><strong>Total Amount:</strong> Rs {order.grandTotal.toFixed(2)}</div>
              </div>
            </div>

            <div className="order-info-section">
              <h3>Customer Information</h3>
              <div className="order-info-grid">
                <div><strong>Name:</strong> {order.userInfo.fullName}</div>
                <div><strong>Email:</strong> {order.userInfo.email}</div>
                <div><strong>Phone:</strong> {order.userInfo.phone}</div>
              </div>
            </div>

            <div className="order-info-section">
              <h3>Order Items</h3>
              <table className="order-items-table">
                <thead>
                  <tr>
                    <th>Glass Type</th>
                    <th>Size</th>
                    <th>Dimensions</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.glassType}</td>
                      <td>{item.size}</td>
                      <td>{item.widthFt}' x {item.heightFt}'</td>
                      <td>{item.quantity}</td>
                      <td>Rs {item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="order-info-section">
              <h3>Delivery Details</h3>
              {order.deliveryMethod === "pickup" ? (
                <>
                  <div><strong>Pickup Location:</strong> ALUX Panadura - Alubomulla</div>
                  <div><strong>Pickup Date:</strong> {order.pickupDate}</div>
                  <div><strong>Pickup Time:</strong> {order.pickupTimeSlot}</div>
                </>
              ) : (
                <>
                  <div><strong>Delivery Address:</strong> {order.selectedLocation?.address || "Manually entered"}</div>
                  <div><strong>Distance:</strong> {order.distance} km</div>
                  <div><strong>Delivery Date:</strong> {order.deliveryDate}</div>
                  <div><strong>Delivery Time:</strong> {order.deliveryTimeSlot}</div>
                  {order.urgentDelivery && <div><strong>Urgent Delivery:</strong> Yes (+25%)</div>}
                  {order.insurance && <div><strong>Insurance:</strong> Included</div>}
                </>
              )}
            </div>

            <div className="order-info-section">
              <h3>Order Status History</h3>
              <div className="order-timeline">
                {order.orderStatusHistory.map((history, idx) => (
                  <div key={idx} className="order-timeline-item">
                    <div className="order-timeline-dot"></div>
                    <div className="order-timeline-content">
                      <div className="order-timeline-status">{getStatusText(history.status)}</div>
                      <div className="order-timeline-date">{new Date(history.timestamp).toLocaleString()}</div>
                      {history.note && <div className="order-timeline-note">{history.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-info-section">
              <h3>Update Status</h3>
              <div className="order-status-update">
                <select 
                  className="order-status-select"
                  value={order.status}
                  onChange={(e) => {
                    updateOrderStatus(order.id, e.target.value);
                    onClose();
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="ontheway">On The Way</option>
                  <option value="delivered">Delivered</option>
                </select>
                <input
                  type="text"
                  className="order-status-note"
                  placeholder="Add note (optional)"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="order-modal-footer">
            <button className="order-modal-delete-btn" onClick={() => {
              onClose();
              setOrderToDelete(order);
              setShowDeleteConfirm(true);
            }}>Delete Order</button>
            <button className="order-modal-close-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-orders-container">
      <Toaster position="top-right" />
      
      <div className="admin-orders-header">
        <h1>Order Management</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.processing}</div>
            <div className="stat-label">Processing</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.dispatched}</div>
            <div className="stat-label">Dispatched</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.ontheway}</div>
            <div className="stat-label">On The Way</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.delivered}</div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>
      </div>

      <div className="admin-orders-filters">
        <button 
          className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          All Orders ({stats.total})
        </button>
        <button 
          className={`filter-btn ${filterStatus === "pending" ? "active" : ""}`}
          onClick={() => setFilterStatus("pending")}
        >
          Pending ({stats.pending})
        </button>
        <button 
          className={`filter-btn ${filterStatus === "processing" ? "active" : ""}`}
          onClick={() => setFilterStatus("processing")}
        >
          Processing ({stats.processing})
        </button>
        <button 
          className={`filter-btn ${filterStatus === "dispatched" ? "active" : ""}`}
          onClick={() => setFilterStatus("dispatched")}
        >
          Dispatched ({stats.dispatched})
        </button>
        <button 
          className={`filter-btn ${filterStatus === "ontheway" ? "active" : ""}`}
          onClick={() => setFilterStatus("ontheway")}
        >
          On The Way ({stats.ontheway})
        </button>
        <button 
          className={`filter-btn ${filterStatus === "delivered" ? "active" : ""}`}
          onClick={() => setFilterStatus("delivered")}
        >
          Delivered ({stats.delivered})
        </button>
      </div>

      <div className="admin-orders-table-wrapper">
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Bill Number</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Delivery</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredOrders().map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.billNumber}</td>
                <td>{order.userInfo.fullName}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>{order.items.length} items</td>
                <td>Rs {order.grandTotal.toFixed(2)}</td>
                <td>{order.deliveryMethod === "pickup" ? "Pickup" : "Delivery"}</td>
                <td><span className={getStatusBadgeClass(order.status)}>{getStatusText(order.status)}</span></td>
                <td>
                  <button className="view-order-btn" onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderModal(true);
                  }}>View</button>
                  <button className="delete-order-btn" onClick={() => {
                    setOrderToDelete(order);
                    setShowDeleteConfirm(true);
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showOrderModal && selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => {
          setShowOrderModal(false);
          setSelectedOrder(null);
        }} />
      )}

      {showDeleteConfirm && orderToDelete && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete order <strong>{orderToDelete.id}</strong>?</p>
            <p>This action cannot be undone.</p>
            <div className="delete-confirm-buttons">
              <button className="delete-confirm-yes" onClick={deleteOrder}>Yes, Delete</button>
              <button className="delete-confirm-no" onClick={() => {
                setShowDeleteConfirm(false);
                setOrderToDelete(null);
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManage;