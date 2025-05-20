import React from 'react';
import Login from './components/Login/Login'; 

function LoginPage({ onLoginSuccess }) {
  return (
    <div>
      <Login onLoginSuccess={onLoginSuccess} />
    </div>
  );
}

export default LoginPage;