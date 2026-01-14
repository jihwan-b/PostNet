import React, { useState } from 'react';

const LOCATIONS = [
    { id: 'engineering', name: '공학원', icon: '🏗️' },
    { id: 'engineeringHall', name: '공학관', icon: '🏛️' },
    { id: 'centralLibrary', name: '중앙도서관', icon: '📚' },
    { id: 'baekyang', name: '백양누리', icon: '🏢' },
    { id: 'student', name: '학생회관', icon: '🎭' },
    { id: 'science', name: '과학관', icon: '🔬' },
    { id: 'scienceInstitute', name: '과학원', icon: '⚗️' },
    { id: 'yongjae', name: '용재홀', icon: '🎓' },
    { id: 'business', name: '경영관', icon: '💼' },
    { id: 'daewoo', name: '대우관', icon: '🏫' },
    { id: 'samsungHall', name: '삼성관', icon: '🏬' },
    { id: 'widang', name: '위당관', icon: '📖' },
    { id: 'auditorium', name: '대강당', icon: '🎤' },
    { id: 'music', name: '음악관', icon: '🎵' },
    { id: 'muak', name: '무악학사', icon: '🏠' },
];

const LocationSelector = ({ selectedLocations = [], onLocationToggle, onLogEvent }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (location) => {
        onLocationToggle(location);

        // Firebase 이벤트 로깅
        if (onLogEvent) {
            const isSelected = selectedLocations.includes(location.id);
            onLogEvent(isSelected ? 'location_removed' : 'location_added', {
                location_id: location.id,
                location_name: location.name
            });
        }
    };

    // 선택된 위치들의 아이콘 표시
    const getDisplayContent = () => {
        if (selectedLocations.length === 0) {
            return <span className="text-gray-400">📍 위치 선택</span>;
        } else if (selectedLocations.length <= 3) {
            return (
                <div className="flex items-center gap-1">
                    {selectedLocations.map((locId) => {
                        const loc = LOCATIONS.find((l) => l.id === locId);
                        return loc ? <span key={locId} className="text-lg">{loc.icon}</span> : null;
                    })}
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-1">
                    {selectedLocations.slice(0, 2).map((locId) => {
                        const loc = LOCATIONS.find((l) => l.id === locId);
                        return loc ? <span key={locId} className="text-lg">{loc.icon}</span> : null;
                    })}
                    <span className="text-sm text-purple-300 font-medium">+{selectedLocations.length - 2}</span>
                </div>
            );
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-500/30 transition-all"
            >
                {getDisplayContent()}
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown - 그리드 레이아웃 */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-[340px] bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-3">
                            <p className="text-center text-xs text-gray-400 font-medium mb-3">
                                📍 캠퍼스 위치 선택 (복수 선택 가능)
                            </p>
                            {/* 아이콘 그리드 */}
                            <div className="grid grid-cols-5 gap-2">
                                {LOCATIONS.map((location) => {
                                    const isSelected = selectedLocations.includes(location.id);
                                    return (
                                        <button
                                            key={location.id}
                                            onClick={() => handleToggle(location)}
                                            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isSelected
                                                ? 'bg-purple-500/30 ring-2 ring-purple-500 scale-105'
                                                : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                            title={location.name}
                                        >
                                            <span className="text-2xl mb-1">{location.icon}</span>
                                            <span className={`text-[10px] font-medium truncate w-full text-center ${isSelected ? 'text-purple-300' : 'text-gray-400'}`}>
                                                {location.name.length > 4 ? location.name.substring(0, 4) + '..' : location.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="border-t border-white/10 p-2 flex gap-2">
                            <button
                                onClick={() => {
                                    // 전체 선택/해제
                                    if (selectedLocations.length === LOCATIONS.length) {
                                        // 전체 해제는 적어도 하나는 남김
                                        LOCATIONS.slice(1).forEach(loc => {
                                            if (selectedLocations.includes(loc.id)) {
                                                onLocationToggle(loc);
                                            }
                                        });
                                    } else {
                                        LOCATIONS.forEach(loc => {
                                            if (!selectedLocations.includes(loc.id)) {
                                                onLocationToggle(loc);
                                            }
                                        });
                                    }
                                }}
                                className="flex-1 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-all"
                            >
                                {selectedLocations.length === LOCATIONS.length ? '전체 해제' : '전체 선택'}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
                            >
                                완료
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export { LOCATIONS };
export default LocationSelector;
