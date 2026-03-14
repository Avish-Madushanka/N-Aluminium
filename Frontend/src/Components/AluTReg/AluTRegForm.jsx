import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Home, Calendar, FileText, Upload, X, AlertCircle, CheckCircle } from "lucide-react";
import "./AluTRegForm.css";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const ALLOWED_DOC_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

function AluTRegForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    address: "",
    birthday: "",
    gender: "",
    email: "",
    phone: "",
  });

  const [idPhoto, setIdPhoto] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleFile = (e, setFile, setPreview, allowedTypes) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File "${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type for "${file.name}"`);
      return;
    }
    setFile(file);
    if (allowedTypes === ALLOWED_IMAGE_TYPES) setPreview(URL.createObjectURL(file));
  };

  const clearFile = (type) => {
    if (type === "id") {
      setIdPhoto(null);
      setIdPreview(null);
      document.getElementById("idUpload").value = "";
    } else {
      setCvFile(null);
      document.getElementById("cvUpload").value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (idPreview) URL.revokeObjectURL(idPreview);
    };
  }, [idPreview]);

  const validateForm = () => {
    const required = ["fullName", "idNumber", "address", "birthday", "gender", "email", "phone"];
    for (const field of required) {
      if (!formData[field]) {
        setError(`${field.replace(/([A-Z])/g, " ").replace(/^./, (s) => s.toUpperCase())} is required`);
        return false;
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Enter a valid email address");
      return false;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Phone number must be 10 digits");
      return false;
    }

    if (!idPhoto) {
      setError("Please upload an ID photo");
      return false;
    }

    if (!cvFile) {
      setError("Please upload your CV");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (validateForm()) {
      // Prepare data for popup
      setPopupData({
        ...formData,
        idPhotoName: idPhoto?.name,
        cvFileName: cvFile?.name,
        idPhoto: idPhoto,
        cvFile: cvFile
      });
      setShowPopup(true);
    }
  };

  const handleConfirmSubmit = () => {
    setShowPopup(false);
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess("Registration successful!");
      setFormData({
        fullName: "",
        idNumber: "",
        address: "",
        birthday: "",
        gender: "",
        email: "",
        phone: "",
      });
      clearFile("id");
      clearFile("cv");
      setPopupData(null);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    }, 2000);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupData(null);
  };

  return (
    <div className="UR-main-container">
      <div className="UR-form-wrapper">
        <h2 className="UR-title">Participant Registration Form</h2>

        {error && (
          <div className="UR-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="UR-success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="UR-form-grid">
            {/* Left Column */}
            <div className="UR-left-col">
              <div className="UR-form-group">
                <label><User size={16}/> Full Name*</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" />
              </div>

              <div className="UR-form-group">
                <label><FileText size={16}/> ID Number*</label>
                <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="Enter your ID number" />
              </div>

              <div className="UR-form-group">
                <label><Calendar size={16}/> Birthday*</label>
                <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} />
              </div>

              <div className="UR-form-group">
                <label>Gender*</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="UR-form-group">
                <label><Mail size={16}/> Email Address*</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
              </div>
            </div>

            {/* Right Column */}
            <div className="UR-right-col">
              <div className="UR-form-group">
                <label><Home size={16}/> Address*</label>
                <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter your address" rows="3"></textarea>
              </div>

              <div className="UR-form-group">
                <label><Phone size={16}/> Phone Number*</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="07XXXXXXXX" maxLength="10" />
              </div>

              <div className="UR-form-group">
                <label><Upload size={16}/> Upload ID Photo*</label>
                <div className="UR-upload-area">
                  <input id="idUpload" type="file" accept={ALLOWED_IMAGE_TYPES.join(",")} onChange={(e) => handleFile(e, setIdPhoto, setIdPreview, ALLOWED_IMAGE_TYPES)} />
                  {idPhoto && <button type="button" onClick={() => clearFile("id")}><X size={14}/></button>}
                </div>
                {idPreview && <img src={idPreview} alt="ID Preview" className="UR-preview-img" />}
              </div>

              <div className="UR-form-group">
                <label><Upload size={16}/> Upload CV (PDF/DOC)*</label>
                <div className="UR-upload-area">
                  <input id="cvUpload" type="file" accept={ALLOWED_DOC_TYPES.join(",")} onChange={(e) => handleFile(e, setCvFile, () => {}, ALLOWED_DOC_TYPES)} />
                  {cvFile && <button type="button" onClick={() => clearFile("cv")}><X size={14}/></button>}
                </div>
                {cvFile && <p className="UR-file-name">{cvFile.name}</p>}
              </div>
            </div>
          </div>

          <button type="submit" className="UR-submit" disabled={loading}>
            {loading ? "Registering..." : "Submit Registration"}
          </button>
        </form>

        {/* Confirmation Popup */}
        {showPopup && popupData && (
          <div className="UR-popup-overlay">
            <div className="UR-popup-content">
              <div className="UR-popup-header">
                <h3>Confirm Registration</h3>
                <button className="UR-popup-close" onClick={handleClosePopup}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="UR-popup-body">
                <p>Please review your information before submitting:</p>
                
                <div className="UR-popup-info-grid">
                  <div className="UR-popup-info-item">
                    <strong>Full Name:</strong>
                    <span>{popupData.fullName}</span>
                  </div>
                  <div className="UR-popup-info-item">
                    <strong>ID Number:</strong>
                    <span>{popupData.idNumber}</span>
                  </div>
                  <div className="UR-popup-info-item">
                    <strong>Birthday:</strong>
                    <span>{popupData.birthday}</span>
                  </div>
                  <div className="UR-popup-info-item">
                    <strong>Gender:</strong>
                    <span>{popupData.gender}</span>
                  </div>
                  <div className="UR-popup-info-item">
                    <strong>Email:</strong>
                    <span>{popupData.email}</span>
                  </div>
                  <div className="UR-popup-info-item">
                    <strong>Phone:</strong>
                    <span>{popupData.phone}</span>
                  </div>
                  <div className="UR-popup-info-item">
                    <strong>Address:</strong>
                    <span>{popupData.address}</span>
                  </div>
                  <div className="UR-popup-info-item">
                    <strong>ID Photo:</strong>
                    <span>{popupData.idPhotoName}</span>
                  </div>
                  <div className="UR-popup-info-item">
                    <strong>CV File:</strong>
                    <span>{popupData.cvFileName}</span>
                  </div>
                </div>
              </div>
              
              <div className="UR-popup-footer">
                <button className="UR-popup-btn UR-popup-btn-cancel" onClick={handleClosePopup}>
                  Cancel
                </button>
                <button className="UR-popup-btn UR-popup-btn-confirm" onClick={handleConfirmSubmit}>
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AluTRegForm;