import React from 'react';
import PosterCard from './PosterCard';

const PosterGrid = ({ posters }) => {
    if (posters.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl text-gray-400">선택한 카테고리에 해당하는 포스터가 없습니다.</p>
                <p className="text-sm text-gray-500 mt-2">다른 카테고리를 선택해 보세요.</p>
            </div>
        );
    }

    return (
        <div className="px-6 pb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {posters.map((poster) => (
                    <PosterCard key={poster.id} poster={poster} />
                ))}
            </div>
        </div>
    );
};

export default PosterGrid;
