import React, { useState, useEffect, useCallback } from 'react';
import API_ENDPOINTS from '../../../apiConfig';
import axiosInstance from '../../../api/axiosInstance'; 
import './AdScrap.css';
import { ClipLoader } from 'react-spinners';
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff, FaSave, FaTimes } from 'react-icons/fa';

try {
    console.log('[AdScrap Initial Load] Attempting to log API_ENDPOINTS. Imported value:', API_ENDPOINTS ? 'Object received' : 'UNDEFINED/FAILED IMPORT');
    if (API_ENDPOINTS) {
        console.log('[AdScrap Initial Load] API_ENDPOINTS structure:', JSON.parse(JSON.stringify(API_ENDPOINTS)));
        console.log('[AdScrap Initial Load] API_ENDPOINTS.SCRAP_TYPES specifically:', JSON.parse(JSON.stringify(API_ENDPOINTS.SCRAP_TYPES || {})));
    }
} catch (e) {
    console.error("[AdScrap Initial Load] Error during initial logging of API_ENDPOINTS. This usually means the import failed.", e);
}


const AdScrap = () => {
    const [scrapTypes, setScrapTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [currentScrapType, setCurrentScrapType] = useState({
        _id: null,
        name: '',
        price: '',
        unit: 'kg',
        description: '',
        isActive: true,
    });
    const [formError, setFormError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const fetchScrapTypes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (typeof API_ENDPOINTS === 'undefined' || !API_ENDPOINTS?.SCRAP_TYPES?.GET_ALL) {
                console.error('[AdScrap Fetch] CRITICAL: API_ENDPOINTS or SCRAP_TYPES.GET_ALL is not defined. API_ENDPOINTS:', API_ENDPOINTS);
                setError('Configuration error: API endpoint for fetching scrap types is missing. Please check console.');
                setIsLoading(false);
                return;
            }
            const response = await axiosInstance.get(API_ENDPOINTS.SCRAP_TYPES.GET_ALL);
            if (response.data && response.data.success) {
                setScrapTypes(response.data.data);
            } else {
                setError(response.data?.message || 'Failed to fetch scrap types.');
            }
        } catch (err) {
            console.error("Error fetching scrap types:", err);
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (typeof API_ENDPOINTS === 'undefined') {
            console.error("[AdScrap useEffect] API_ENDPOINTS is undefined. Check import path for apiConfig.js.");
            setError("CRITICAL CONFIGURATION ERROR: API Endpoints not loaded. Check console.");
        } else if (!API_ENDPOINTS.SCRAP_TYPES) {
            console.error("[AdScrap useEffect] API_ENDPOINTS.SCRAP_TYPES is undefined. Check apiConfig.js definition.");
            setError("CRITICAL CONFIGURATION ERROR: SCRAP_TYPES endpoints not defined in API configuration. Check console.");
        } else {
            fetchScrapTypes();
        }
    }, [fetchScrapTypes]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentScrapType(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const resetForm = () => {
        setCurrentScrapType({ _id: null, name: '', price: '', unit: 'kg', description: '', isActive: true });
        setIsEditing(false);
        setFormError('');
        setIsFormVisible(false);
    };

    const handleAddNew = () => {
        resetForm();
        setIsEditing(false);
        setIsFormVisible(true);
    };

    const handleEdit = (scrapType) => {
        setCurrentScrapType({ ...scrapType, price: String(scrapType.price) });
        setIsEditing(true);
        setIsFormVisible(true);
        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (typeof API_ENDPOINTS === 'undefined' || !API_ENDPOINTS.SCRAP_TYPES) {
            console.error('[AdScrap Submit] CRITICAL: API_ENDPOINTS or API_ENDPOINTS.SCRAP_TYPES is undefined. Cannot submit form.');
            setFormError('Configuration error: API Endpoints not loaded. Cannot submit. Check console.');
            return;
        }

        if (!currentScrapType.name.trim() || currentScrapType.price === '' || isNaN(parseFloat(currentScrapType.price))) {
            setFormError('Name and a valid Price are required.');
            return;
        }
        if (parseFloat(currentScrapType.price) < 0) {
             setFormError('Price cannot be negative.');
             return;
        }

        const endpointPath = isEditing ? API_ENDPOINTS.SCRAP_TYPES.UPDATE_ONE : API_ENDPOINTS.SCRAP_TYPES.CREATE;
        if (!endpointPath) {
            console.error(`[AdScrap Submit] Configuration Error: Endpoint for ${isEditing ? 'update' : 'create'} is not defined in API_ENDPOINTS.SCRAP_TYPES.`);
            setFormError(`Configuration error: Endpoint for ${isEditing ? 'updating' : 'creating'} scrap type is missing. Check console.`);
            return;
        }

        setIsLoading(true);
        const payload = {
            ...currentScrapType,
            price: parseFloat(currentScrapType.price),
        };

        try {
            let response;
            if (isEditing) {
                response = await axiosInstance.put(`${endpointPath}/${currentScrapType._id}`, payload);
            } else {
                const { _id, ...createPayload } = payload;
                response = await axiosInstance.post(endpointPath, createPayload);
            }

            if (response.data && response.data.success) {
                fetchScrapTypes();
                resetForm();
            } else {
                setFormError(response.data?.message || `Failed to ${isEditing ? 'update' : 'create'} scrap type.`);
            }
        } catch (err) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} scrap type:`, err);
            setFormError(err.response?.data?.message || err.message || 'An unexpected server error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (typeof API_ENDPOINTS === 'undefined' || !API_ENDPOINTS?.SCRAP_TYPES?.DELETE_ONE) {
            console.error('[AdScrap Delete] CRITICAL: API_ENDPOINTS or DELETE_ONE path is not defined.', API_ENDPOINTS);
            setError('Configuration error: API endpoint for deleting scrap type is missing. Check console.');
            return;
        }
        if (window.confirm(`Are you sure you want to deactivate scrap type: "${name}"? This is a soft delete.`)) {
            setIsLoading(true);
            try {
                const response = await axiosInstance.delete(`${API_ENDPOINTS.SCRAP_TYPES.DELETE_ONE}/${id}`);
                if (response.data && response.data.success) {
                    fetchScrapTypes();
                } else {
                    setError(response.data?.message || 'Failed to delete scrap type.');
                }
            } catch (err) {
                console.error("Error deleting scrap type:", err);
                setError(err.response?.data?.message || err.message || 'An unexpected error occurred during deletion.');
            } finally {
                setIsLoading(false);
            }
        }
    };

     const handleToggleActive = async (scrapType) => {
        if (typeof API_ENDPOINTS === 'undefined' || !API_ENDPOINTS?.SCRAP_TYPES?.UPDATE_ONE) {
            console.error('[AdScrap ToggleActive] CRITICAL: API_ENDPOINTS or UPDATE_ONE path is not defined.', API_ENDPOINTS);
            setError('Configuration error: API endpoint for updating scrap type is missing. Check console.');
            return;
        }
        setIsLoading(true);
        const updatedScrapType = { ...scrapType, isActive: !scrapType.isActive };
        try {
            const response = await axiosInstance.put(`${API_ENDPOINTS.SCRAP_TYPES.UPDATE_ONE}/${scrapType._id}`, updatedScrapType);
            if (response.data && response.data.success) {
                fetchScrapTypes();
            } else {
                setError(response.data?.message || 'Failed to toggle status.');
            }
        } catch (err) {
            console.error("Error toggling scrap type status:", err);
            setError(err.response?.data?.message || err.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !isFormVisible && scrapTypes.length === 0) {
        return (
            <div className="adscrap-loading">
                <ClipLoader size={50} color="#f97316" />
                <p>Loading Scrap Types...</p>
            </div>
        );
    }

    if (typeof API_ENDPOINTS === 'undefined' || !API_ENDPOINTS.SCRAP_TYPES) {
        return (
            <div className="admin-scrap-management error-state">
                <h1>Configuration Error</h1>
                <p className="error-message global-error" style={{backgroundColor: '#ffdddd', border: '1px solid red', padding: '15px', borderRadius: '5px'}}>
                    CRITICAL: The API configuration for Scrap Types (API_ENDPOINTS.SCRAP_TYPES) could not be loaded.
                    This is likely due to an incorrect import path for <strong>apiConfig.js</strong> or the <strong>SCRAP_TYPES</strong> section missing in <strong>apiConfig.js</strong>.
                    Please check the browser's developer console for more specific error messages.
                </p>
            </div>
        );
    }

    return (
        <div className="admin-scrap-management">
            <h1 className="admin-scrap-title">Manage Scrap Types</h1>
            {error && <p className="error-message global-error">{error}</p>}
            <button onClick={handleAddNew} className="add-new-scrap-btn" disabled={isFormVisible || isLoading}>
                <FaPlus /> Add New Scrap Type
            </button>
            {isFormVisible && (
                <div className="scrap-form-container">
                    <form onSubmit={handleSubmit} className="scrap-form">
                        <h2>{isEditing ? 'Edit' : 'Add New'} Scrap Type</h2>
                        {formError && <p className="error-message form-error">{formError}</p>}
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input type="text" id="name" name="name" value={currentScrapType.name} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Price:</label>
                            <input type="number" id="price" name="price" step="0.01" min="0" value={currentScrapType.price} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="unit">Unit:</label>
                            <input type="text" id="unit" name="unit" value={currentScrapType.unit} onChange={handleInputChange} placeholder="e.g., kg, item, ton"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description (Optional):</label>
                            <textarea id="description" name="description" value={currentScrapType.description} onChange={handleInputChange}></textarea>
                        </div>
                        <div className="form-group form-group-checkbox">
                            <label htmlFor="isActive">Active:</label>
                            <input type="checkbox" id="isActive" name="isActive" checked={currentScrapType.isActive} onChange={handleInputChange} />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={isLoading}>
                                {isLoading ? <ClipLoader size={18} color="#fff" /> : <FaSave />} {isEditing ? 'Update' : 'Create'}
                            </button>
                            <button type="button" onClick={resetForm} className="cancel-btn" disabled={isLoading}>
                                <FaTimes /> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div className="scrap-types-table-container">
                <table className="scrap-types-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Unit</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scrapTypes.length === 0 && !isLoading && (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No scrap types found.</td></tr>
                        )}
                        {scrapTypes.map((st) => (
                            <tr key={st._id} className={!st.isActive ? 'inactive-row' : ''}>
                                <td>{st.name}</td>
                                <td>{typeof st.price === 'number' ? st.price.toFixed(2) : String(st.price)}</td>
                                <td>{st.unit}</td>
                                <td className="description-cell">{st.description || '-'}</td>
                                <td>
                                    <button
                                        onClick={() => handleToggleActive(st)}
                                        className={`status-toggle ${st.isActive ? 'active' : 'inactive'}`}
                                        title={st.isActive ? 'Set to Inactive' : 'Set to Active'}
                                        disabled={isLoading}
                                    >
                                        {st.isActive ? <FaToggleOn /> : <FaToggleOff />}
                                        {st.isActive ? ' Active' : ' Inactive'}
                                    </button>
                                </td>
                                <td className="actions-cell">
                                    <button onClick={() => handleEdit(st)} className="action-btn edit-btn" title="Edit" disabled={isLoading || isFormVisible}>
                                        <FaEdit />
                                    </button>
                                    {st.isActive && (
                                         <button onClick={() => handleDelete(st._id, st.name)} className="action-btn delete-btn" title="Deactivate (Soft Delete)" disabled={isLoading || isFormVisible}>
                                             <FaTrash />
                                         </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isLoading && scrapTypes.length > 0 && !isFormVisible && (
                    <div className="table-loader">
                        <ClipLoader size={30} color="#f97316" /> <p>Updating list...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdScrap;