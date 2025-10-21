import React from 'react';
import './AluTRegForm.css';
import {
  FaRecycle,
  FaLightbulb,
  FaTools,
  FaBuilding,
  FaClipboardList,
  FaCheckCircle,
  FaFileAlt,
  FaUserEdit
} from 'react-icons/fa';

function AluTRegForm() {
  return (
    <div className="AluTRegMain">
      <div className="Alu-Container">

        <section className="Alu-Section Alu-RegistrationForm">
          <h2 className="Alu-SectionTitle">🖊️ Register Now</h2>
          <p className="Alu-SectionContent">
            Fill out the form below to join the Aluminum Training Program. Our team will review your registration and confirm your participation through email within 24–48 hours.
          </p>
          <form className="Alu-Form">
            <div className="Alu-FormField">
              <label htmlFor="Alu-Name" className="Alu-Label">Full Name</label>
              <input type="text" id="Alu-Name" name="fullName" className="Alu-Input" required />
            </div>
            <div className="Alu-FormField">
              <label htmlFor="Alu-Email" className="Alu-Label">Email Address</label>
              <input type="email" id="Alu-Email" name="email" className="Alu-Input" required />
            </div>
            <div className="Alu-FormField">
              <label htmlFor="Alu-Phone" className="Alu-Label">Contact Number</label>
              <input type="tel" id="Alu-Phone" name="phoneNumber" className="Alu-Input" required />
            </div>
            <div className="Alu-FormField">
              <label htmlFor="Alu-Category" className="Alu-Label">Preferred Training Category</label>
              <select id="Alu-Category" name="category" className="Alu-Select" required>
                <option value="">Select a Category</option>
                <option value="basic">Basic Recycling Awareness</option>
                <option value="intermediate">Intermediate Recycling & Collection Management</option>
                <option value="advanced">Advanced Processing & Safety Handling</option>
                <option value="business">Business and Reuse Training</option>
              </select>
            </div>
            <div className="Alu-FormField">
              <label htmlFor="Alu-Date" className="Alu-Label">Preferred Training Date</label>
              <input type="date" id="Alu-Date" name="trainingDate" className="Alu-Input" required />
            </div>
            <div className="Alu-FormField">
              <label htmlFor="Alu-Mode" className="Alu-Label">Training Mode</label>
              <select id="Alu-Mode" name="mode" className="Alu-Select" required>
                <option value="">Select Mode</option>
                <option value="online">Online</option>
                <option value="on-site">On-Site</option>
              </select>
            </div>
            <div className="Alu-FormField Alu-IDUploadField">
              <label htmlFor="Alu-IDUpload" className="Alu-Label">
                <FaFileAlt className="Alu-FileUploadIcon" /> Upload ID/Proof of Occupation (Optional)
              </label>
              <input type="file" id="Alu-IDUpload" name="idUpload" className="Alu-FileInput" />
            </div>
            <div className="Alu-FormField Alu-CheckboxContainer">
              <input type="checkbox" id="Alu-Terms" name="terms" className="Alu-Checkbox" required />
              <label htmlFor="Alu-Terms" className="Alu-CheckboxLabel">
                I have read and agree to the terms and conditions.
              </label>
            </div>
            <button type="submit" className="Alu-SubmitButton">
              <FaUserEdit className="Alu-ButtonIcon" /> Register
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AluTRegForm;
