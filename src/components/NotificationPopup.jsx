import React, { useState, useEffect } from 'react';

const NotificationPopup = ({ notification, onViewDetail, onSave, onDismiss, onLogEvent }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
            setIsExiting(false);
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

    if (!notification || !isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${isExiting ? 'opacity-0' : 'opacity-100'
                    }`}
                onClick={() => handleAction('notification_dismissed')}
            />

            {/* Popup */}
            <div
                className={`relative w-full max-w-sm bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-purple-500/10 overflow-hidden transition-all duration-300 pointer-events-auto ${isExiting ? 'opacity-0 transform scale-95 translate-y-4' : 'opacity-100 transform scale-100 translate-y-0'
                    }`}
            >
                {/* Header */}
                <div className="relative px-5 pt-5 pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-purple-400">새로운 알림</span>
                        </div>
                        <button
                            onClick={() => handleAction('notification_dismissed')}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-5 pb-4">
                    {notification.thumbnail && (
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                            <img
                                src={notification.thumbnail}
                                alt={notification.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <span className="absolute bottom-2 left-2 px-2 py-1 text-xs bg-purple-500/80 text-white rounded-full">
                                {notification.location}
                            </span>
                        </div>
                    )}

                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {notification.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                        {notification.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {notification.tags?.map((tag, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 flex gap-3">
                    <button
                        onClick={() => handleAction('save_to_archive')}
                        className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        보관함 저장
                    </button>
                    <button
                        onClick={() => handleAction('view_detail_click')}
                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                    >
                        자세히 보기
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationPopup;
