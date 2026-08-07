import React from 'react';

export function StarRating({ rating, size = "text-sm" }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <i key={i} className={`fa-star ${size} ${i <= Math.round(rating) ? 'fas star-filled' : 'far star-empty'}`}></i>
        );
    }
    return <div className="flex gap-0.5">{stars}</div>;
}
