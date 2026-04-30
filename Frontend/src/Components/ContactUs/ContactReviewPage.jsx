import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaLongArrowAltRight, FaHome } from 'react-icons/fa';
import axios from 'axios';
import './ContactReviewPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

const ContactReviewPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        expertise: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) return "Name is required";
        if (!formData.email.trim()) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) return "Please enter a valid email address";
        if (!formData.expertise) return "Please select an expertise area";
        if (!formData.message.trim()) return "Message is required";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationError = validateForm();
        if (validationError) {
            setSubmitError(validationError);
            setTimeout(() => setSubmitError(''), 4000);
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');
        
        try {
            const response = await axios.post(`${API_URL}/contact/submit`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
            
            if (response.data.success) {
                setSubmitSuccess(true);
                setFormData({ 
                    name: '', 
                    email: '', 
                    phone: '', 
                    location: '', 
                    expertise: '', 
                    message: '' 
                });
                setTimeout(() => setSubmitSuccess(false), 4000);
            } else {
                throw new Error(response.data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            let errorMessage = 'Failed to send message. Please try again.';
            
            if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timed out. Please try again.';
            } else if (error.response) {
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'Unable to reach server. Please check your connection.';
            }
            
            setSubmitError(errorMessage);
            setTimeout(() => setSubmitError(''), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="Con-root">
            <section className="Con-hero">
                <div className="Con-hero-overlay"></div>
                <div className="Con-hero-content">
                    <h1>CONTACT US</h1>
                </div>
            </section>

            <div className="Con-intro-section">
                <div className="Con-intro-header">
                    <span className="Con-intro-tag">GET IN TOUCH</span>
                    <h2 className="Con-intro-title">
                        Let's Discuss Your <br /> Aluminum Solutions
                    </h2>
                    <p className="Con-intro-sub">
                        Whether you need custom fabrication, scrap collection, or market insights, 
                        our team is here to help you optimize your resources.
                    </p>
                </div>
            </div>

            <div className="Con-main-wrapper">
                <div className="Con-container">
                    <div className="Con-info-side">
                        <h2 className="Con-main-heading">
                            <span>Connect</span> with Our Team of Experts
                        </h2>
                        <p className="Con-sub-heading">
                            Contact our team of excellence-driven experts today to bring your project to life.
                        </p>

                        <div className="Con-main-layout">
                            <div className="Con-info-column">
                                <div className="Con-info-row">
                                    <div className="Con-icon-bg"><FaHome /></div>
                                    <div className="Con-text-group">
                                        <h3>Address</h3>
                                        <p>426F Shanthi Garden,<br />Alubomulla, Panadura</p>
                                    </div>
                                </div>

                                <div className="Con-info-row">
                                    <div className="Con-icon-bg"><FaPhoneAlt /></div>
                                    <div className="Con-text-group">
                                        <h3>Phone</h3>
                                        <p>+94 72 104 6048</p>
                                    </div>
                                </div>

                                <div className="Con-info-row">
                                    <div className="Con-icon-bg"><FaEnvelope /></div>
                                    <div className="Con-text-group">
                                        <h3>Email</h3>
                                        <p>donotreply.ALUX@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="Con-form-side">
                        <form onSubmit={handleSubmit} className="Con-real-form" noValidate>
                            <div className="Con-form-row">
                                <div className="Con-input-box">
                                    <label>Full Name <span>*</span></label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        placeholder="Full Name" 
                                        required 
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="Con-input-box">
                                    <label>Email Address <span>*</span></label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        placeholder="Email Address" 
                                        required 
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="Con-form-row">
                                <div className="Con-input-box">
                                    <label>Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handleChange} 
                                        placeholder="Phone Number" 
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="Con-input-box">
                                    <label>Location</label>
                                    <input 
                                        type="text" 
                                        name="location" 
                                        value={formData.location} 
                                        onChange={handleChange} 
                                        placeholder="Location" 
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="Con-input-box full-width">
                                <label>What Expertise You're Interested In <span>*</span></label>
                                <select 
                                    name="expertise" 
                                    value={formData.expertise} 
                                    onChange={handleChange} 
                                    required 
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select</option>
                                    <option value="fabrication">Aluminum Fabrication</option>
                                    <option value="scrap">Scrap Collection</option>
                                    <option value="marketplace">Material Marketplace</option>
                                </select>
                            </div>

                            <div className="Con-input-box full-width">
                                <label>Tell Us About Your Project <span>*</span></label>
                                <textarea 
                                    name="message" 
                                    value={formData.message} 
                                    onChange={handleChange} 
                                    placeholder="Leave your message here" 
                                    required 
                                    rows="4"
                                    className="Con-message-textarea"
                                    disabled={isSubmitting}
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="Con-submit-btn-real" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "SENDING..." : <>SUBMIT <FaLongArrowAltRight /></>}
                            </button>

                            {submitSuccess && (
                                <div className="Con-success-box">
                                    ✓ Message sent successfully! We'll get back to you soon.
                                </div>
                            )}
                            
                            {submitError && (
                                <div className="Con-error-box">
                                    ⚠ {submitError}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactReviewPage;