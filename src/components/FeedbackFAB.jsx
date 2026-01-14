import React from 'react';

const FeedbackFAB = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-40 group"
            aria-label="피드백 보내기"
        >
            <div className="relative">
                {/* Pulse animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-ping opacity-25"></div>

                {/* Button */}
                <div className="relative flex items-center gap-2 px-5 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg shadow-purple-500/30 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-purple-500/40 group-hover:scale-105">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-white font-medium text-sm">피드백 보내기</span>
                </div>
            </div>
        </button>
    );
};

export default FeedbackFAB;
