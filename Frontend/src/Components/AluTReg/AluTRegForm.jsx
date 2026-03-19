import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Home, Calendar, FileText, Upload, X, AlertCircle, CheckCircle, Loader, Eye } from "lucide-react";
import axios from "axios";
import "./AluTRegForm.css";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const ALLOWED_DOC_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5003/api";

function AluTRegForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    address: "",
    birthday: "",
    gender: "",
    email: "",
    phone: ""
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [idPhoto, setIdPhoto] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setError("");
  };

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field) => {
    let errorMsg = "";
    
    switch (field) {
      case "fullName":
        if (!formData.fullName.trim()) errorMsg = "Full name is required";
        else if (formData.fullName.trim().length < 3) errorMsg = "Name must be at least 3 characters";
        else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) errorMsg = "Name can only contain letters and spaces";
        break;
      
      case "idNumber":
        if (!formData.idNumber.trim()) errorMsg = "ID number is required";
        else if (formData.idNumber.trim().length < 5) errorMsg = "ID number must be at least 5 characters";
        break;
      
      case "address":
        if (!formData.address.trim()) errorMsg = "Address is required";
        break;
      
      case "birthday":
        if (!formData.birthday) errorMsg = "Birthday is required";
        else {
          const birthDate = new Date(formData.birthday);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18) errorMsg = "You must be at least 18 years old";
        }
        break;
      
      case "gender":
        if (!formData.gender) errorMsg = "Gender is required";
        break;
      
      case "email":
        if (!formData.email) errorMsg = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errorMsg = "Enter a valid email address";
        break;
      
      case "phone":
        if (!formData.phone) errorMsg = "Phone number is required";
        else if (!/^[0-9]{10}$/.test(formData.phone)) errorMsg = "Phone number must be exactly 10 digits";
        break;
      
      default:
        break;
    }
    
    setFieldErrors((prev) => ({ ...prev, [field]: errorMsg }));
    return !errorMsg;
  };

  const handleFile = (e, setFile, setPreview, allowedTypes, fileType) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFieldErrors((prev) => ({ ...prev, [fileType]: `File exceeds ${MAX_FILE_SIZE_MB}MB limit` }));
      e.target.value = "";
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      setFieldErrors((prev) => ({ ...prev, [fileType]: `Invalid file type. Allowed: ${allowedTypes.join(", ")}` }));
      e.target.value = "";
      return;
    }
    
    setFieldErrors((prev) => ({ ...prev, [fileType]: "" }));
    setFile(file);
    if (allowedTypes === ALLOWED_IMAGE_TYPES) {
      if (idPreview) URL.revokeObjectURL(idPreview);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearFile = (type) => {
    if (type === "id") {
      if (idPreview) URL.revokeObjectURL(idPreview);
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
    const fields = ["fullName", "idNumber", "address", "birthday", "gender", "email", "phone"];
    let isValid = true;
    const errors = {};
    
    fields.forEach(field => {
      const fieldValid = validateField(field);
      if (!fieldValid) {
        isValid = false;
        errors[field] = fieldErrors[field];
      }
    });
    
    if (!idPhoto) {
      errors.idPhoto = "ID photo is required";
      isValid = false;
    }
    
    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (validateForm()) {
      setPopupData({
        ...formData,
        idPhotoName: idPhoto?.name,
        cvFileName: cvFile?.name || null,
        idPhoto: idPhoto,
        cvFile: cvFile
      });
      setShowPopup(true);
    } else {
      setError("Please fix all errors before submitting");
    }
  };

  const handleConfirmSubmit = async () => {
    setShowPopup(false);
    setLoading(true);
    setError("");
    
    try {
      const formDataToSend = new FormData();
      Object.keys(popupData).forEach(key => {
        if (key !== "idPhotoName" && key !== "cvFileName") {
          if (key === "idPhoto" || key === "cvFile") {
            if (popupData[key]) formDataToSend.append(key, popupData[key]);
          } else {
            formDataToSend.append(key, popupData[key]);
          }
        }
      });
      
      const response = await axios.post(`${API_URL}/alumni/register`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (response.data.success) {
        setSuccess(response.data.message);
        setFormData({
          fullName: "", idNumber: "", address: "", birthday: "", gender: "", email: "", phone: ""
        });
        clearFile("id");
        clearFile("cv");
        setFieldErrors({});
        setTouchedFields({});
        setPopupData(null);
        
        setTimeout(() => setSuccess(""), 5003);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupData(null);
  };

  const isFieldInvalid = (field) => {
    return touchedFields[field] && fieldErrors[field];
  };

  const getInputClassName = (field) => {
    return `UR-input ${isFieldInvalid(field) ? "UR-input-error" : ""}`;
  };

  return (
    <div className="UR-main-container">
      <div className="UR-form-wrapper">
        <span className="UR-subtitle">ALUMNI REGISTRATION</span>
        <h2 className="UR-title">Join Our Alumni Program</h2>
        <p className="UR-description">Fill in your details to become part of our alumni community</p>

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

        <form onSubmit={handleSubmit} noValidate>
          <div className="UR-form-grid">
            <div className="UR-left-col">
              <div className="UR-form-group">
                <label><User size={16}/> Full Name <span className="UR-required">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("fullName")}
                  className={getInputClassName("fullName")}
                  placeholder="Enter your full name"
                />
                {isFieldInvalid("fullName") && (
                  <span className="UR-field-error">{fieldErrors.fullName}</span>
                )}
              </div>

              <div className="UR-form-group">
                <label><FileText size={16}/> ID Number <span className="UR-required">*</span></label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  onBlur={() => handleBlur("idNumber")}
                  className={getInputClassName("idNumber")}
                  placeholder="Enter your ID number"
                />
                {isFieldInvalid("idNumber") && (
                  <span className="UR-field-error">{fieldErrors.idNumber}</span>
                )}
              </div>

              <div className="UR-form-group">
                <label><Calendar size={16}/> Birthday <span className="UR-required">*</span></label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  onBlur={() => handleBlur("birthday")}
                  className={getInputClassName("birthday")}
                />
                {isFieldInvalid("birthday") && (
                  <span className="UR-field-error">{fieldErrors.birthday}</span>
                )}
              </div>

              <div className="UR-form-group">
                <label>Gender <span className="UR-required">*</span></label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onBlur={() => handleBlur("gender")}
                  className={getInputClassName("gender")}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {isFieldInvalid("gender") && (
                  <span className="UR-field-error">{fieldErrors.gender}</span>
                )}
              </div>
            </div>

            <div className="UR-right-col">
              <div className="UR-form-group">
                <label><Home size={16}/> Address <span className="UR-required">*</span></label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={() => handleBlur("address")}
                  className={getInputClassName("address")}
                  placeholder="Enter your address"
                  rows="3"
                ></textarea>
                {isFieldInvalid("address") && (
                  <span className="UR-field-error">{fieldErrors.address}</span>
                )}
              </div>

              <div className="UR-form-group">
                <label><Mail size={16}/> Email Address <span className="UR-required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className={getInputClassName("email")}
                  placeholder="Enter your email"
                />
                {isFieldInvalid("email") && (
                  <span className="UR-field-error">{fieldErrors.email}</span>
                )}
              </div>

              <div className="UR-form-group">
                <label><Phone size={16}/> Phone Number <span className="UR-required">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur("phone")}
                  className={getInputClassName("phone")}
                  placeholder="07XXXXXXXX"
                  maxLength="10"
                />
                {isFieldInvalid("phone") && (
                  <span className="UR-field-error">{fieldErrors.phone}</span>
                )}
              </div>

              <div className="UR-form-group">
                <label><Upload size={16}/> Upload ID Photo <span className="UR-required">*</span></label>
                <div className="UR-upload-container">
                  <div className="UR-upload-area">
                    <input
                      id="idUpload"
                      type="file"
                      accept={ALLOWED_IMAGE_TYPES.join(",")}
                      onChange={(e) => handleFile(e, setIdPhoto, setIdPreview, ALLOWED_IMAGE_TYPES, "idPhoto")}
                      className={fieldErrors.idPhoto ? "UR-upload-error" : ""}
                    />
                    {idPhoto && (
                      <button type="button" onClick={() => clearFile("id")} className="UR-clear-btn">
                        <X size={14}/>
                      </button>
                    )}
                  </div>
                  {fieldErrors.idPhoto && (
                    <span className="UR-field-error">{fieldErrors.idPhoto}</span>
                  )}
                </div>
                {idPreview && (
                  <div className="UR-preview-container">
                    <img src={idPreview} alt="ID Preview" className="UR-preview-img" />
                    <button type="button" className="UR-preview-btn" onClick={() => window.open(idPreview)}>
                      <Eye size={16}/>
                    </button>
                  </div>
                )}
              </div>

              <div className="UR-form-group">
                <label><Upload size={16}/> Upload CV (Optional)</label>
                <div className="UR-upload-container">
                  <div className="UR-upload-area">
                    <input
                      id="cvUpload"
                      type="file"
                      accept={ALLOWED_DOC_TYPES.join(",")}
                      onChange={(e) => handleFile(e, setCvFile, () => {}, ALLOWED_DOC_TYPES, "cvFile")}
                    />
                    {cvFile && (
                      <button type="button" onClick={() => clearFile("cv")} className="UR-clear-btn">
                        <X size={14}/>
                      </button>
                    )}
                  </div>
                  {cvFile && (
                    <p className="UR-file-name">
                      {cvFile.name}
                      <span className="UR-file-size"> ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </p>
                  )}
                </div>
                <span className="UR-hint">Accepted: PDF, DOC, DOCX (Max 5MB)</span>
              </div>
            </div>
          </div>

          <button type="submit" className="UR-submit" disabled={loading}>
            {loading ? (
              <>
                <Loader size={18} className="UR-spinner" />
                <span>Processing...</span>
              </>
            ) : (
              "Submit Registration"
            )}
          </button>
        </form>

        {showPopup && popupData && (
          <div className="UR-popup-overlay">
            <div className="UR-popup-content">
              <div className="UR-popup-header">
                <h3>Review Your Information</h3>
                <button className="UR-popup-close" onClick={handleClosePopup}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="UR-popup-body">
                <p className="UR-popup-subtitle">Please verify all details before submitting</p>
                
                <div className="UR-popup-info-grid">
                  <div className="UR-popup-info-item">
                    <strong>Full Name</strong>
                    <span>{popupData.fullName}</span>
                  </div>
                  
                  <div className="UR-popup-info-item">
                    <strong>ID Number</strong>
                    <span>{popupData.idNumber}</span>
                  </div>
                  
                  <div className="UR-popup-info-item">
                    <strong>Birthday</strong>
                    <span>{new Date(popupData.birthday).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="UR-popup-info-item">
                    <strong>Gender</strong>
                    <span>{popupData.gender === "male" ? "Male" : "Female"}</span>
                  </div>
                  
                  <div className="UR-popup-info-item">
                    <strong>Email</strong>
                    <span>{popupData.email}</span>
                  </div>
                  
                  <div className="UR-popup-info-item">
                    <strong>Phone</strong>
                    <span>{popupData.phone}</span>
                  </div>
                  
                  <div className="UR-popup-info-item">
                    <strong>Address</strong>
                    <span>{popupData.address}</span>
                  </div>
                  
                  <div className="UR-popup-info-item">
                    <strong>ID Photo</strong>
                    <span>{popupData.idPhotoName}</span>
                  </div>
                  
                  <div className="UR-popup-info-item">
                    <strong>CV File</strong>
                    <span className={!popupData.cvFileName ? "UR-not-uploaded" : ""}>
                      {popupData.cvFileName || "Not uploaded"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="UR-popup-footer">
                <button className="UR-popup-btn UR-popup-btn-cancel" onClick={handleClosePopup}>
                  Go Back
                </button>
                <button 
                  className="UR-popup-btn UR-popup-btn-confirm" 
                  onClick={handleConfirmSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Confirm & Submit"}
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