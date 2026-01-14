import React from 'react';

const Header = () => {
    return (
        <header className="relative py-12 px-6 text-center">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl"></div>
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
