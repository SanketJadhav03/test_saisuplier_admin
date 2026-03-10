import React from 'react';

const BarcodeSearchP = ({ results }) => {
    const popupStyles = {
        position: 'absolute',
        width: '100%',
        maxHeight: '250px',
        overflowY: 'auto',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1,
    };

    const popupItemStyles = {
        padding: '8px',
        cursor: 'pointer',
        borderBottom: '1px solid #ccc',
    };

    return (
        <div className="popup" style={popupStyles}>
            {results.map(product => (
                <div key={product.product_hsn_code} className="popup-item" style={popupItemStyles}>
                    {product.product_english_name} - {product.product_hsn_code}
                </div>
            ))}
        </div>
    );
};

export default BarcodeSearchP;
