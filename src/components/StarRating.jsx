import React, { useState } from 'react';

const StarRating = ({ rating = 0, onChange, size = 32, readonly = false, label = "전체 만족도" }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (value) => {
        if (!readonly && onChange) {
            onChange(value);
        }
    };

    const handleMouseEnter = (value) => {
        if (!readonly) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const displayRating = hoverRating || rating;

    return (
        <div className="flex flex-col items-start gap-3">
            {label && (
                <span className="text-white font-semibold text-lg">{label}</span>
            )}
            <div
                className="flex gap-2"
                onMouseLeave={handleMouseLeave}
            >
                {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= displayRating;
                    return (
                        <button
                            key={star}
                            type="button"
                            onClick={() => handleClick(star)}
                            onMouseEnter={() => handleMouseEnter(star)}
                            disabled={readonly}
                            className={`transition-all duration-200 ${!readonly ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                                }`}
                            style={{ width: size, height: size }}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width={size}
                                height={size}
                                className="transition-all duration-200"
                            >
                                <defs>
                                    <linearGradient id={`starGradient-${star}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#fbbf24" />
                                        <stop offset="100%" stopColor="#f59e0b" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                    fill={isFilled ? `url(#starGradient-${star})` : 'transparent'}
                                    stroke={isFilled ? '#f59e0b' : '#4b5563'}
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default StarRating;
