import React, { useState, useEffect } from 'react';

const SearchPopup = ({ results }) => {
    console.log("called");
    const [selectedIdx, setSelectedIdx] = useState(-1);

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
        borderLeft: '3px solid transparent', // Add left border for selection indicator
        backgroundColor: selectedIdx === -1 ? 'transparent' : 'lightgray', // Add background color for selected item
    };

    useEffect(() => {
        // const handleKeyDown = (event) => {
        //     if (results.length === 0) return;

        //     if (event.key === 'ArrowDown') {
        //         console.log("kasdf");
        //         setSelectedIdx((prevIdx) => (prevIdx + 1) % results.length);
        //     } else if (event.key === 'ArrowUp') {
        //         setSelectedIdx((prevIdx) => (prevIdx - 1 + results.length) % results.length);
        //     }
        // };

        // window.addEventListener('keydown', handleKeyDown);

        return () => {
            // window.removeEventListener('keydown', handleKeyDown);
        };
    }, [results]);

    return (
        <div className="popup" style={popupStyles}>
            {results.map((product, index) => (
                <input
                    key={product.no}
                    className="popup-item"
                    style={{
                        ...popupItemStyles,
                        borderLeftColor: selectedIdx === index ? 'blue' : 'transparent', // Set left border color for selected item
                    }}
                    type="text"
                    value={product.name}
                    readOnly
                />

            ))}
        </div>
    );
};

export default SearchPopup;
