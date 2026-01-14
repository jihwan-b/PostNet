import React, { useState, useEffect } from 'react';

const StreakBadge = ({ streak, visible }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (visible && streak > 1) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 500);
            return () => clearTimeout(timer);
        }
    }, [streak, visible]);

    if (!visible || streak < 2) return null;

    return (
        <div
            className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${isAnimating ? 'scale-110' : 'scale-100'
                }`}
        >
            <div className="px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-2">
                <span className="text-2xl animate-bounce">🔥</span>
                <span className="text-white font-bold">
                    연속 {streak}회 반응 성공!
                </span>
            </div>
        </div>
    );
};

export default StreakBadge;
