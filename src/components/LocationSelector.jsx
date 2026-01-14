import React, { useState } from 'react';

const LOCATIONS = [
    { id: 'engineering', name: '공학관', icon: '🏗️' },
    { id: 'humanities', name: '인문관', icon: '📖' },
    { id: 'library', name: '중앙도서관', icon: '📚' },
    { id: 'student', name: '학생회관', icon: '🏢' },
    { id: 'science', name: '자연과학관', icon: '🔬' },
    { id: 'art', name: '예술관', icon: '🎨' },
];

const LocationSelector = ({ currentLocation, onLocationChange, onLogEvent }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (location) => {
        onLocationChange(location);
        setIsOpen(false);

        // Firebase 이벤트 로깅
        if (onLogEvent) {
            onLogEvent('location_changed', {
                location_id: location.id,
                location_name: location.name
            });
        }
    };

    const currentLoc = LOCATIONS.find((loc) => loc.id === currentLocation) || LOCATIONS[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-500/30 transition-all"
            >
                <div className="flex items-center gap-2">
                    <span className="text-xl">{currentLoc.icon}</span>
                    <span className="text-white font-medium">{currentLoc.name}</span>
                </div>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full mt-2 left-0 w-56 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-2">
                            <p className="px-3 py-2 text-xs text-gray-400 font-medium">현재 위치 선택</p>
                            {LOCATIONS.map((location) => (
                                <button
                                    key={location.id}
                                    onClick={() => handleSelect(location)}
                                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${currentLocation === location.id
                                            ? 'bg-purple-500/20 text-purple-300'
                                            : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    <span className="text-xl">{location.icon}</span>
                                    <span className="font-medium">{location.name}</span>
                                    {currentLocation === location.id && (
                                        <svg className="w-4 h-4 ml-auto text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export { LOCATIONS };
export default LocationSelector;
