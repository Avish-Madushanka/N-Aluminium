import React from 'react';
import '../RegistrationForm/RegistrationForm.css'; 

const RegistrationForm = () => {
  return (
    <div className="background-container">
      <div className="button-row">
        <button className="button">Admin</button>
        <button className="button">Business Owners</button>
        <button className="button">Clients</button>
        <button className="button1">Sign Up</button>
      </div>
    </div>
  );
};

export default RegistrationForm;