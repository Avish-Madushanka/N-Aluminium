import React from 'react';
import Login from './components/Login/Login'; // Adjust path if needed

// onLoginSuccess will be passed down from App.jsx
function LoginPage({ onLoginSuccess }) {
  return (
    <div>
      {/* You can add a page-specific layout or header here if needed */}
      <Login onLoginSuccess={onLoginSuccess} />
    </div>
  );
}

export default LoginPage;