import React from 'react';
import './RegistrationForm.css';

const RegistrationForm = () => {
  return (
    <div className="Regsignup-container">
      <h1 className="Regsignup-title">Signup</h1>
      <div className="Regadmin-buttons">
        <div className="Regadmin-button">
          <img src="https://img.freepik.com/free-vector/people-loading-garbage-into-truck-trash-pickup-with-recycling-sign-flat-vector-illustration-garbage-disposal-volunteering-trash-collection_74855-13197.jpg" alt="Admin 1" />
          <a href="/admin1" className="Regbutton-1">Admin</a>
        </div>
        <div className="Regadmin-button">
          <img src="https://media.istockphoto.com/id/688587628/photo/aluminium-and-pvc-industry-worker.jpg?s=612x612&w=0&k=20&c=j3W5LQbi0yV0RH0-DLqGs6VeFGlV60Vm_OaiIAMPoTo=" alt="BOwnerForm" />
          <a href="/BOwnerForm" className="Regbutton-2">Business Owners</a>
        </div>
        <div className="Regadmin-button">
          <img src="https://media.istockphoto.com/id/910835860/photo/you-can-reach-me-via-text.jpg?s=170667a&w=0&k=20&c=upFKf6tl_UrSMhJ_FOkhuFD9fgW2jFCUtgCLRgF7QDU=" alt="ClientForm" />
          <a href="/ClientForm" className="Regbutton-3">Clients</a>
        </div>
      </div>
      <a href="/Login" className="Reglogin-button">Login</a>
    </div>
  );
};

export default RegistrationForm;