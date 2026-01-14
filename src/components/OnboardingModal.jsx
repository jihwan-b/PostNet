import React, { useState, useEffect } from 'react';

const GRADES = [
    { id: '1', label: '1학년', emoji: '🌱' },
    { id: '2', label: '2학년', emoji: '🌿' },
    { id: '3', label: '3학년', emoji: '🌳' },
    { id: '4', label: '4학년', emoji: '🎯' },
    { id: 'leave', label: '휴학', emoji: '⏸️' },
    { id: 'complete', label: '수료', emoji: '📋' },
    { id: 'graduate', label: '졸업', emoji: '🎓' },
];

const COLLEGES = [
    { id: 'liberal_arts', label: '문과대학', emoji: '📖' },
    { id: 'commerce', label: '상경대학', emoji: '📊' },
    { id: 'business', label: '경영대학', emoji: '💼' },
    { id: 'science', label: '이과대학', emoji: '🔬' },
    { id: 'engineering', label: '공과대학', emoji: '⚙️' },
    { id: 'life_science', label: '생명시스템대학', emoji: '🧬' },
    { id: 'ai_convergence', label: '인공지능융합대학', emoji: '🤖' },
    { id: 'theology', label: '신과대학', emoji: '✝️' },
    { id: 'social_science', label: '사회과학대학', emoji: '🏛️' },
    { id: 'music', label: '음악대학', emoji: '🎵' },
    { id: 'human_ecology', label: '생활과학대학', emoji: '🏠' },
    { id: 'education', label: '교육과학대학', emoji: '📚' },
    { id: 'underwood', label: '언더우드국제대학', emoji: '🌍' },
    { id: 'global_talent', label: '글로벌인재대학', emoji: '🌐' },
    { id: 'medicine', label: '의과대학', emoji: '⚕️' },
    { id: 'dentistry', label: '치과대학', emoji: '🦷' },
    { id: 'nursing', label: '간호대학', emoji: '💉' },
    { id: 'pharmacy', label: '약학대학', emoji: '💊' },
];

const CATEGORIES = [
    { id: 'job', label: '취업', emoji: '💼', description: '채용, 인턴십, 취업설명회' },
    { id: 'scholarship', label: '장학', emoji: '🎓', description: '장학금, 교환학생, 학비지원' },
    { id: 'event', label: '학교 행사', emoji: '🎉', description: '축제, 체육대회, 특강' },
    { id: 'club', label: '동아리&학회', emoji: '👥', description: '동아리 모집, 학회 세미나' },
    { id: 'education', label: '교육&강연', emoji: '📚', description: '특강, 워크샵, 자격증' },
];

const OnboardingModal = ({ isOpen, onComplete }) => {
    const [step, setStep] = useState(1);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedGrade(null);
            setSelectedCollege(null);
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
            } else if (step === 2 && selectedGrade) {
                setStep(3);
            } else if (step === 3 && selectedCollege) {
                setStep(4);
            } else if (step === 4 && selectedCategories.length > 0) {
                setStep(5);
                // 2.5초 후 자동으로 완료
                setTimeout(() => {
                    onComplete(selectedCategories, { grade: selectedGrade, college: selectedCollege });
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

                {/* Step 2: Grade Selection */}
                {step === 2 && (
                    <div className="text-center">
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                학년을 선택해 주세요
                            </h2>
                            <p className="text-gray-400">
                                현재 학적 상태를 알려주세요
                            </p>
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-4">
                            {GRADES.slice(0, 4).map((grade) => {
                                const isSelected = selectedGrade === grade.id;
                                return (
                                    <button
                                        key={grade.id}
                                        onClick={() => setSelectedGrade(grade.id)}
                                        className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center ${isSelected
                                            ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                                            : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-2xl mb-1 block">{grade.emoji}</span>
                                        <h3 className={`font-semibold text-sm ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                                            {grade.label}
                                        </h3>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {GRADES.slice(4).map((grade) => {
                                const isSelected = selectedGrade === grade.id;
                                return (
                                    <button
                                        key={grade.id}
                                        onClick={() => setSelectedGrade(grade.id)}
                                        className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center ${isSelected
                                            ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                                            : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-2xl mb-1 block">{grade.emoji}</span>
                                        <h3 className={`font-semibold text-sm ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                                            {grade.label}
                                        </h3>
                                    </button>
                                );
                            })}
                        </div>

                        {selectedGrade && (
                            <button
                                onClick={handleNext}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all hover:scale-105"
                            >
                                다음
                            </button>
                        )}

                        {!selectedGrade && (
                            <p className="text-sm text-gray-500">
                                학년을 선택해 주세요
                            </p>
                        )}
                    </div>
                )}

                {/* Step 3: College Selection */}
                {step === 3 && (
                    <div className="text-center">
                        <div className="mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                소속 대학을 선택해 주세요
                            </h2>
                            <p className="text-gray-400">
                                어느 단과대학에 소속되어 있나요?
                            </p>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {COLLEGES.map((college) => {
                                    const isSelected = selectedCollege === college.id;
                                    return (
                                        <button
                                            key={college.id}
                                            onClick={() => setSelectedCollege(college.id)}
                                            className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${isSelected
                                                ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                                                : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                                                }`}
                                        >
                                            <span className="text-xl mb-1 block">{college.emoji}</span>
                                            <h3 className={`font-medium text-xs ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                                                {college.label}
                                            </h3>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {selectedCollege && (
                            <button
                                onClick={handleNext}
                                className="mt-4 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all hover:scale-105"
                            >
                                다음
                            </button>
                        )}

                        {!selectedCollege && (
                            <p className="mt-4 text-sm text-gray-500">
                                단과대학을 선택해 주세요
                            </p>
                        )}
                    </div>
                )}

                {/* Step 4: Category Selection */}
                {step === 4 && (
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

                {/* Step 5: Completion */}
                {step === 5 && (
                    <div className="text-center">
                        <div className="mb-8">
                            <span className="text-6xl mb-6 block">✨</span>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                설정 완료!
                            </h2>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                앞으로{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                                    관련 소식
                                </span>을<br />
                                안내해 드릴게요
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-center gap-2">
                                <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">
                                    {GRADES.find((g) => g.id === selectedGrade)?.emoji} {GRADES.find((g) => g.id === selectedGrade)?.label}
                                </span>
                                <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm">
                                    {COLLEGES.find((c) => c.id === selectedCollege)?.emoji} {COLLEGES.find((c) => c.id === selectedCollege)?.label}
                                </span>
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
                        </div>

                        <div className="mt-8">
                            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto animate-pulse"></div>
                        </div>
                    </div>
                )}

                {/* Step indicator */}
                <div className="flex justify-center gap-2 mt-10">
                    {[1, 2, 3, 4, 5].map((s) => (
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
