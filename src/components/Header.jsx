import React from 'react';

const Header = ({ onArchiveClick, savedCount = 0, onSettingsReset }) => {
    return (
        <header className="relative py-12 px-6 text-center">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl"></div>
            </div>

            {/* Top Right Buttons */}
            <div className="absolute top-6 right-6 z-20 flex gap-2">
                {/* Settings Reset Button */}
                <button
                    onClick={onSettingsReset}
                    className="p-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-500/30 transition-all group"
                    title="설정 초기화"
                >
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>

                {/* Archive Button */}
                <button
                    onClick={onArchiveClick}
                    className="relative p-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-500/30 transition-all group"
                    title="보관함"
                >
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    {savedCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                            {savedCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="relative z-10">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                        PostNet
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 font-light tracking-wide">
                    나에게 딱 맞는 교내 정보
                </p>
                <div className="mt-6 flex justify-center gap-2">
                    <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <div className="w-2 h-1 bg-purple-500/50 rounded-full"></div>
                    <div className="w-2 h-1 bg-pink-500/50 rounded-full"></div>
                </div>
            </div>
        </header>
    );
};

export default Header;

