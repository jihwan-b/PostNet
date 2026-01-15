import React, { useState, useEffect } from 'react';

const NotificationPopup = ({ notification, onViewDetail, onSave, onDismiss, onLogEvent, onFeedback }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [feedbackGiven, setFeedbackGiven] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
            setIsExiting(false);
            setFeedbackGiven(null);
            setShowFeedback(false);
        }
    }, [notification]);

    const handleAction = (action) => {
        setIsExiting(true);

        // Firebase 이벤트 로깅
        if (onLogEvent && notification) {
            onLogEvent(action, {
                notification_id: notification.id,
                notification_title: notification.title,
                category: notification.category,
            });
        }

        setTimeout(() => {
            setIsVisible(false);
            if (action === 'view_detail_click') {
                onViewDetail?.(notification);
            } else if (action === 'save_to_archive') {
                onSave?.(notification);
            } else {
                onDismiss?.();
            }
        }, 300);
    };

    const handleFeedback = async (isHelpful) => {
        setFeedbackGiven(isHelpful);

        // Firebase에 피드백 기록
        if (onFeedback) {
            await onFeedback(notification?.id, isHelpful);
        }

        // 잠시 후 팝업 닫기
        setTimeout(() => {
            handleAction(isHelpful ? 'feedback_helpful' : 'feedback_not_helpful');
        }, 800);
    };

    if (!notification || !isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 md:max-w-sm md:w-full pointer-events-none">
            {/* Toast Notification - More compact on mobile */}
            <div
                className={`pointer-events-auto bg-slate-800/95 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/10 shadow-2xl shadow-purple-500/20 overflow-hidden transition-all duration-300 ${isExiting
                    ? 'opacity-0 transform translate-y-full md:translate-y-0 md:translate-x-full'
                    : 'opacity-100 transform translate-y-0 md:translate-x-0'
                    }`}
            >
                {/* Header - Compact */}
                <div className="relative px-3 md:px-4 pt-3 md:pt-4 pb-1 md:pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] md:text-xs font-medium text-purple-400">새로운 알림</span>
                        </div>
                        <button
                            onClick={() => handleAction('notification_dismissed')}
                            className="p-0.5 md:p-1 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content - Compact layout on mobile */}
                <div className="px-3 md:px-4 pb-2 md:pb-3">
                    <div className="flex gap-2 md:gap-3 items-center">
                        {/* Thumbnail - Smaller on mobile */}
                        {notification.thumbnail && (
                            <div className="relative w-10 h-10 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={notification.thumbnail}
                                    alt={notification.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xs md:text-sm font-semibold text-white mb-0.5 md:mb-1 line-clamp-1 md:line-clamp-2">
                                {notification.title}
                            </h3>
                            <span className="inline-block px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs bg-purple-500/30 text-purple-300 rounded-full">
                                {notification.location}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions - Compact buttons on mobile */}
                <div className="px-3 md:px-4 pb-2 md:pb-3 flex gap-1.5 md:gap-2">
                    <button
                        onClick={() => handleAction('save_to_archive')}
                        className="flex-1 py-1.5 md:py-2 bg-white/5 border border-white/10 text-white text-xs md:text-sm font-medium rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-1"
                    >
                        <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        저장
                    </button>
                    <button
                        onClick={() => handleAction('view_detail_click')}
                        className="flex-1 py-1.5 md:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs md:text-sm font-medium rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-1"
                    >
                        보기
                        <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Feedback Toggle Button */}
                {!showFeedback && (
                    <div className="px-3 md:px-4 pb-2 md:pb-3">
                        <button
                            onClick={() => setShowFeedback(true)}
                            className="w-full py-1 text-[10px] md:text-xs text-gray-400 hover:text-gray-300 transition-colors flex items-center justify-center gap-1"
                        >
                            <span>이 알림이 유용한가요?</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Helpful Feedback Section - Collapsible */}
                {showFeedback && (
                    <div className="px-3 md:px-4 pb-3 md:pb-4 border-t border-white/10 pt-2 md:pt-3 animate-fadeIn">
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => handleFeedback(true)}
                                disabled={feedbackGiven !== null}
                                className={`px-3 md:px-4 py-1 md:py-1.5 rounded-lg text-xs md:text-sm transition-all flex items-center gap-1 ${feedbackGiven === true
                                    ? 'bg-green-500/30 text-green-300 scale-105'
                                    : feedbackGiven !== null
                                        ? 'bg-white/5 text-gray-500 opacity-50'
                                        : 'bg-white/10 text-white hover:bg-green-500/20 hover:text-green-300'
                                    }`}
                            >
                                <span>👍</span>
                                {feedbackGiven === true && <span className="text-[10px] md:text-xs">감사해요!</span>}
                            </button>
                            <button
                                onClick={() => handleFeedback(false)}
                                disabled={feedbackGiven !== null}
                                className={`px-3 md:px-4 py-1 md:py-1.5 rounded-lg text-xs md:text-sm transition-all flex items-center gap-1 ${feedbackGiven === false
                                    ? 'bg-red-500/30 text-red-300 scale-105'
                                    : feedbackGiven !== null
                                        ? 'bg-white/5 text-gray-500 opacity-50'
                                        : 'bg-white/10 text-white hover:bg-red-500/20 hover:text-red-300'
                                    }`}
                            >
                                <span>👎</span>
                                {feedbackGiven === false && <span className="text-[10px] md:text-xs">개선할게요</span>}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add fadeIn animation */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default NotificationPopup;
