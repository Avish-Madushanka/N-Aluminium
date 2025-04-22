// src/components/UserCalendar/Utils/SummaryItem.jsx
import React from 'react';

const SummaryItem = ({ IconComponent, label, value }) => {
    if (!value) return null; // Don't render if value is missing

    return (
        <p className="summary-item">
            {IconComponent && <IconComponent size={16} />} {/* Conditionally render icon */}
            <strong>{label}:</strong> {value}
        </p>
    );
};

export default SummaryItem;