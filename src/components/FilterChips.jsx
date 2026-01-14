import React from 'react';

const CATEGORIES = [
    { id: 'job', label: '취업', emoji: '💼' },
    { id: 'event', label: '학교 행사', emoji: '🎉' },
    { id: 'club', label: '동아리&학회', emoji: '👥' },
    { id: 'education', label: '교육&강연', emoji: '📚' },
];

const FilterChips = ({ selectedCategories, onCategoryToggle }) => {
    return (
        <div className="px-6 py-4">
            <div className="flex flex-wrap justify-center gap-3">
                {CATEGORIES.map((category) => {
                    const isActive = selectedCategories.includes(category.id);
                    return (
                        <button
                            key={category.id}
                            onClick={() => onCategoryToggle(category.id)}
                            className={`chip ${isActive ? 'chip-active' : ''}`}
                        >
                            <span className="mr-2">{category.emoji}</span>
                            {category.label}
                        </button>
                    );
                })}
            </div>
            {selectedCategories.length > 0 && (
                <p className="text-center text-sm text-gray-400 mt-3">
                    {selectedCategories.length}개 카테고리 선택됨
                </p>
            )}
        </div>
    );
};

export { CATEGORIES };
export default FilterChips;
