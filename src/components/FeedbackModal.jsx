import React, { useState } from 'react';

const FEEDBACK_CHOICES = [
    { id: 'design', label: '디자인' },
    { id: 'accuracy', label: '정보 정확성' },
    { id: 'usability', label: '사용성' },
    { id: 'timing', label: '알림 타이밍' },
    { id: 'relevance', label: '맞춤 정확도' },
];

// 가설 검증용 추가 질문
const VALIDATION_QUESTIONS = [
    {
        id: 'spam_feel',
        question: '이 알림이 스팸처럼 느껴지셨나요?',
        options: [
            { value: 1, label: '전혀 아니요' },
            { value: 2, label: '약간 그래요' },
            { value: 3, label: '많이 그래요' },
        ],
    },
    {
        id: 'useful_info',
        question: '알림을 통해 유용한 정보를 얻으셨나요?',
        options: [
            { value: 1, label: '별로예요' },
            { value: 2, label: '보통이에요' },
            { value: 3, label: '매우 유용해요' },
        ],
    },
    {
        id: 'continue_use',
        question: '이 서비스를 계속 사용하고 싶으신가요?',
        options: [
            { value: 1, label: '아니요' },
            { value: 2, label: '고민중이에요' },
            { value: 3, label: '네, 계속 쓸래요' },
        ],
    },
];

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [goodPoints, setGoodPoints] = useState([]);
    const [badPoints, setBadPoints] = useState([]);
    const [validationAnswers, setValidationAnswers] = useState({});
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChoiceToggle = (id, type) => {
        if (type === 'good') {
            setGoodPoints((prev) =>
                prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
            );
        } else {
            setBadPoints((prev) =>
                prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
            );
        }
    };

    const handleValidationAnswer = (questionId, value) => {
        setValidationAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            alert('별점을 선택해 주세요.');
            return;
        }

        setIsSubmitting(true);

        const feedbackData = {
            rating,
            goodPoints,
            badPoints,
            validationAnswers,
            comment,
        };

        await onSubmit(feedbackData);

        // Reset form
        setRating(0);
        setGoodPoints([]);
        setBadPoints([]);
        setValidationAnswers({});
        setComment('');
        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">
                        의견 보내기
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-6 max-h-[65vh] overflow-y-auto">
                    {/* Subtitle */}
                    <p className="text-gray-400 text-sm">서비스 경험을 공유해 주세요!</p>

                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">전체 만족도</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="text-3xl transition-transform hover:scale-110"
                                >
                                    {star <= (hoveredRating || rating) ? '⭐' : '☆'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Validation Questions */}
                    <div className="space-y-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <p className="text-sm font-medium text-purple-300">📊 간단한 질문에 답해주세요</p>
                        {VALIDATION_QUESTIONS.map((q) => (
                            <div key={q.id}>
                                <p className="text-sm text-gray-300 mb-2">{q.question}</p>
                                <div className="flex gap-2">
                                    {q.options.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleValidationAnswer(q.id, opt.value)}
                                            className={`flex-1 py-2 px-3 text-xs rounded-lg border transition-all ${validationAnswers[q.id] === opt.value
                                                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Good/Bad Points */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">👍 좋았던 점</label>
                            <div className="flex flex-wrap gap-1">
                                {FEEDBACK_CHOICES.map((choice) => (
                                    <button
                                        key={choice.id}
                                        onClick={() => handleChoiceToggle(choice.id, 'good')}
                                        className={`px-2 py-1 text-xs rounded-lg border transition-all ${goodPoints.includes(choice.id)
                                                ? 'border-green-500 bg-green-500/20 text-green-300'
                                                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                                            }`}
                                    >
                                        {choice.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">👎 아쉬운 점</label>
                            <div className="flex flex-wrap gap-1">
                                {FEEDBACK_CHOICES.map((choice) => (
                                    <button
                                        key={choice.id}
                                        onClick={() => handleChoiceToggle(choice.id, 'bad')}
                                        className={`px-2 py-1 text-xs rounded-lg border transition-all ${badPoints.includes(choice.id)
                                                ? 'border-red-500 bg-red-500/20 text-red-300'
                                                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                                            }`}
                                    >
                                        {choice.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">자유 의견</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="더 나은 서비스를 위한 의견을 자유롭게 작성해 주세요..."
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-white/10">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? '전송 중...' : '보내기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
