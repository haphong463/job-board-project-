// src/pages/NotificationPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const NotificationPage = () =>
{
    const location = useLocation();
    const navigate = useNavigate();
    const message = location.state?.message || 'An error occurred';

    const handleGoBack = () =>
    {
        navigate(-1); // Quay lại trang trước đó
    };

    return (
        <div className="container mt-5">
            <div className="alert alert-danger">
                <h4 className="alert-heading">Error</h4>
                <p>{message}</p>
                <hr />
                <button className="btn btn-primary" onClick={handleGoBack}>Go Back</button>
            </div>
        </div>
    );
};

