import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import API_ENDPOINTS from '../../apiConfig';
import './ResetPassword.css';

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenParam = queryParams.get('token');
        const emailParam = queryParams.get('email');

        if (!tokenParam || !emailParam) {
            setErrorMessage('Invalid reset link. Please request a new password reset.');
            setIsVerifying(false);
            return;
        }

        setToken(tokenParam);
        setEmail(emailParam);
        verifyToken(tokenParam, emailParam);
    }, [location]);

    const verifyToken = async (tokenParam, emailParam) => {
        setIsVerifying(true);
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.AUTH.VERIFY_RESET_TOKEN, {
                params: { token: tokenParam, email: emailParam }
            });

            if (response.data?.valid) {
                setIsTokenValid(true);
                setErrorMessage('');
            } else {
                setIsTokenValid(false);
                setErrorMessage('Reset link is invalid or has expired. Please request a new one.');
            }
        } catch (err) {
            setIsTokenValid(false);
            setErrorMessage('Reset link is invalid or has expired. Please request a new one.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!newPassword || !confirmPassword) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
                token: token,
                email: email,
                newPassword: newPassword
            });

            if (response.data?.success) {
                setSuccessMessage(response.data.message || 'Password reset successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setErrorMessage(response.data?.message || 'Failed to reset password.');
            }
        } catch (err) {
            if (err.response) {
                setErrorMessage(err.response.data?.message || `Error ${err.response.status}. Please try again.`);
            } else if (err.request) {
                setErrorMessage('Network error. Unable to connect to server.');
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="RP-container">
                <div className="RP-card">
                    <h2>Verifying Reset Link</h2>
                    <div className="RP-loading">Please wait...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="RP-container">
            <div className="RP-card">
                <div className="RP-header">
                    <h2>Create New Password</h2>
                    <p>Please enter your new password below</p>
                </div>

                {errorMessage && (
                    <div className="RP-error">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="RP-success">
                        {successMessage}
                        <p>Redirecting to login...</p>
                    </div>
                )}

                {isTokenValid && !successMessage && (
                    <form onSubmit={handleSubmit} className="RP-form">
                        <div className="RP-form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                disabled={isLoading}
                            />
                            <small>Password must be at least 6 characters</small>
                        </div>

                        <div className="RP-form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="RP-submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                {!isTokenValid && !successMessage && (
                    <div className="RP-link-expired">
                        <p>{errorMessage || 'Reset link is invalid or has expired.'}</p>
                        <Link to="/login" className="RP-back-link">
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;