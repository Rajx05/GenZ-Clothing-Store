import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

export function StarRating({ rating, size = "text-sm" }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const filled = i <= Math.round(rating);
        stars.push(
            <FontAwesomeIcon
                key={i}
                icon={filled ? faStarSolid : faStarRegular}
                className={`${size} ${filled ? 'star-filled' : 'star-empty'}`}
            />
        );
    }
    return <div className="flex gap-0.5">{stars}</div>;
}
