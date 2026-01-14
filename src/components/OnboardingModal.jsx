import React, { useState, useEffect } from 'react';

const CATEGORIES = [
    { id: 'job', label: '취업', emoji: '💼', description: '채용, 인턴십, 취업설명회' },
    { id: 'scholarship', label: '장학', emoji: '🎓', description: '장학금, 교환학생, 학비지원' },
    { id: 'event', label: '학교 행사', emoji: '🎉', description: '축제, 체육대회, 특강' },
    { id: 'club', label: '동아리&학회', emoji: '👥', description: '동아리 모집, 학회 세미나' },
    { id: 'education', label: '교육&강연', emoji: '📚', description: '특강, 워크샵, 자격증' },
];

const OnboardingModal = ({ isOpen, onComplete }) => {
    const [step, setStep] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedCategories([]);
        }
    }, [isOpen]);

    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((c) => c !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleNext = () => {
        setIsAnimating(true);
        setTimeout(() => {
            if (step === 1) {
                setStep(2);
            } else if (step === 2 && selectedCategories.length > 0) {
                setStep(3);
                // 3초 후 자동으로 완료
                setTimeout(() => {
                    onComplete(selectedCategories);
                }, 2500);
            }
            setIsAnimating(false);
        }, 300);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 z-50 flex items-center justify-center p-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className={`relative z-10 w-full max-w-lg transition-all duration-300 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>

                {/* Step 1: Welcome */}
                {step === 1 && (
                    <div className="text-center">
                        <div className="mb-8">
                            <span className="text-6xl mb-6 block animate-bounce">👋</span>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-relaxed">
                                안녕하세요!
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                                바쁜 당신을 위해<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                                    관심 있는 정보만
                                </span> 보여 드릴게요
                            </p>
                        </div>

                        <button
                            onClick={handleNext}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all hover:scale-105"
                        >
                            시작하기
                        </button>
                    </div>
                )}

                {/* Step 2: Category Selection */}
                {step === 2 && (
                    <div className="text-center">
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                관심 분야를 모두 선택해 주세요
                            </h2>
                            <p className="text-gray-400">
                                선택한 분야의 소식만 알려드릴게요
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {CATEGORIES.map((category) => {
                                const isSelected = selectedCategories.includes(category.id);
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryToggle(category.id)}
                                        className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left ${isSelected
                                            ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                                            : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-3xl mb-2 block">{category.emoji}</span>
                                        <h3 className={`font-semibold mb-1 ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                                            {category.label}
                                        </h3>
                                        <p className="text-xs text-gray-400">{category.description}</p>
                                    </button>
                                );
                            })}
                        </div>

                        {selectedCategories.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-sm text-purple-400">
                                    {selectedCategories.length}개 분야 선택됨
                                </p>
                                <button
                                    onClick={handleNext}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all hover:scale-105"
                                >
                                    선택 완료
                                </button>
                            </div>
                        )}

                        {selectedCategories.length === 0 && (
                            <p className="text-sm text-gray-500">
                                최소 1개 이상 선택해 주세요
                            </p>
                        )}
                    </div>
                )}

                {/* Step 3: Completion */}
                {step === 3 && (
                    <div className="text-center">
                        <div className="mb-8">
                            <span className="text-6xl mb-6 block">✨</span>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                선택 완료!
                            </h2>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                앞으로{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                                    관련 소식
                                </span>을<br />
                                안내해 드릴게요
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {selectedCategories.map((catId) => {
                                const cat = CATEGORIES.find((c) => c.id === catId);
                                return (
                                    <span
                                        key={catId}
                                        className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm"
                                    >
                                        {cat?.emoji} {cat?.label}
                                    </span>
                                );
                            })}
                        </div>

                        <div className="mt-8">
                            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto animate-pulse"></div>
                        </div>
                    </div>
                )}

                {/* Step indicator */}
                <div className="flex justify-center gap-2 mt-10">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${s === step
                                ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500'
                                : s < step
                                    ? 'bg-purple-500'
                                    : 'bg-white/20'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
