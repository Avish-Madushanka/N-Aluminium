import React from 'react';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Login</h2>
        <div className="form-group">
          <label htmlFor="username">User Name</label>
          <input type="text" id="username" placeholder="Enter user name" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter user password" />
        </div>
        <button type="submit" className="login-button">Login</button>
      </div>
    </div>
  );
}

export default Login;