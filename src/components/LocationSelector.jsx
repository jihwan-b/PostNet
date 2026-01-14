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

    // 선택된 위치들의 표시 텍스트
    const getDisplayText = () => {
        if (selectedLocations.length === 0) {
            return '위치 선택';
        } else if (selectedLocations.length === 1) {
            const loc = LOCATIONS.find((l) => l.id === selectedLocations[0]);
            return loc ? `${loc.icon} ${loc.name}` : '위치 선택';
        } else {
            return `${selectedLocations.length}개 위치 선택됨`;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-500/30 transition-all"
            >
                <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{getDisplayText()}</span>
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
                    <div className="absolute top-full mt-2 left-0 w-64 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-2">
                            <p className="px-3 py-2 text-xs text-gray-400 font-medium">위치 선택 (복수 선택 가능)</p>
                            {LOCATIONS.map((location) => {
                                const isSelected = selectedLocations.includes(location.id);
                                return (
                                    <button
                                        key={location.id}
                                        onClick={() => handleToggle(location)}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${isSelected
                                            ? 'bg-purple-500/20 text-purple-300'
                                            : 'text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-xl">{location.icon}</span>
                                        <span className="font-medium flex-1 text-left">{location.name}</span>
                                        {isSelected && (
                                            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="border-t border-white/10 p-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
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
