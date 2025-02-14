import React from 'react';
import '../RegistrationForm/RegistrationForm.css'; 

const RegistrationForm = () => {
  return (
    <div className="background-container">
      <div className="button-row">
        <button className="button">Admin</button>
        <a href='/BOwnerForm' className="button">Business Owners</a>
        <button className="button">Clients</button>
        <button className="button1">Login</button>
      </div>
    </div>
  );
};

export default RegistrationForm;