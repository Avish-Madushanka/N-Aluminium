import React from 'react';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <div className="login-content">
        <div className="left-section">
          <h1 className="welcome-title">Welcome</h1>
          <p className="subtitle">Log in to easily schedule pickups, track your requests, and manage your scrap collection history. Join us in promoting sustainable practices by giving your aluminum waste a second life—efficiently and responsibly.</p>
          <div className="social-icons">
            <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
        
        <div className="right-section">
          <h2 className="signin-title">Sign in</h2>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" />
          </div>
          
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
          
          <button className="signin-button">Sign in now</button>
          
          <div className="terms">
            By clicking on "Sign in now" you agree to <br />
            <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;