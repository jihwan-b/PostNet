import React from 'react';
import { incrementUserAction } from '../firebase';

const PosterCard = ({ poster, onSave, isSaved, onCardClick }) => {
    const { thumbnail, title, date, tags } = poster;

    const handleSaveClick = (e) => {
        e.stopPropagation();
        if (onSave) {
            onSave(poster);
        }
    };

    const handleCardClick = () => {
        // Firebase에 포스터 상세 조회 추적
        incrementUserAction('poster_detail_view');
        // 부모 핸들러 호출 (있는 경우)
        if (onCardClick) {
            onCardClick(poster);
        }
    };

    return (
        <article id={`poster-${poster.id}`} className="poster-card group cursor-pointer" onClick={handleCardClick}>
            {/* Thumbnail */}
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Save Button */}
                <button
                    onClick={handleSaveClick}
                    className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-lg border transition-all ${isSaved
                        ? 'bg-purple-500/80 border-purple-400 text-white'
                        : 'bg-black/40 border-white/20 text-white/80 hover:bg-purple-500/60 hover:border-purple-400'
                        }`}
                    title={isSaved ? '보관됨' : '보관함에 저장'}
                >
                    <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {date}
                </p>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
};

export default PosterCard;

