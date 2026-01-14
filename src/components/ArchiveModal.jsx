import React from 'react';

const ArchiveModal = ({ isOpen, onClose, savedNotifications, onMove, onRemove }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        보관함
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {savedNotifications.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p>보관된 알림이 없습니다.</p>
                        </div>
                    ) : (
                        savedNotifications.map((notification) => (
                            <div key={notification.id} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                                        {notification.location}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove(notification.id);
                                        }}
                                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                        title="삭제"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <h3 className="text-white font-medium mb-1 line-clamp-1">{notification.title}</h3>
                                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{notification.description}</p>
                                <button
                                    onClick={() => onMove(notification)}
                                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-sm text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    바로가기
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArchiveModal;
