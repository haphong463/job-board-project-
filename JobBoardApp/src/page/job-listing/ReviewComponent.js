import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StarRating } from './StarRating';

// import StarRatings from 'react-star-ratings';

const ReviewComponent = ({ title, rating, description }) =>
{
    return (
        <div>
            <div className="review-card card shadow-sm p-3 mb-4">
                <h5 className="card-title text-dark mb-3">{title}</h5>
                <StarRating
                    rating={rating}
                    readOnly={true}
                />
                <p className="card-text text-dark mt-3">{description}</p>
            </div>

        </div>
    );
};

export default ReviewComponent;
