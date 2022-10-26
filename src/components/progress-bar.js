import React from 'react';

const ProgressBar = (props) => {
    const { bgcolor, completed, hidden } = props;

    const containerStyles = {
        width: '100%',
        backgroundColor: "#e0e0de",
        borderRadius: 50,
        marginTop: 50,
        marginBottom: 50,
    }

    const fillerStyles = {
        height: '8px',
        width: `${completed}%`,
        backgroundColor: bgcolor,
        borderRadius: 'inherit',
        textAlign: 'right',
        transition: 'width 0.1s ease-in-out',
    }

    const labelStyles = {
        padding: 5,
        color: '#9d9d9d',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        fontSize: '12px',
        lineHeight: '12px',
        position: 'relative',
        bottom: '25px',
    }

    return (
        <div style={containerStyles} hidden={hidden}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${completed}%`}</span>
            </div>
        </div>
    );
};

export default ProgressBar;