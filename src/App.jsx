import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import FilterChips, { CATEGORIES } from './components/FilterChips';
import PosterGrid from './components/PosterGrid';
import FeedbackFAB from './components/FeedbackFAB';
import FeedbackModal from './components/FeedbackModal';
import VisitorCounter from './components/VisitorCounter';
import OnboardingModal from './components/OnboardingModal';
import LocationSelector, { LOCATIONS } from './components/LocationSelector';
import NotificationPopup from './components/NotificationPopup';
import { submitFeedback, logEvent, saveUserCategories, incrementReactionCount } from './firebase';

// 위치별 샘플 공고 데이터
const LOCATION_NOTIFICATIONS = {
    engineering: [
        {
            id: 'n1',
            title: '네이버 2026 상반기 개발자 채용설명회',
            description: '공학관 1층 로비에서 진행됩니다. 관심 있는 분들은 참석해 주세요!',
            thumbnail: 'https://picsum.photos/seed/naver/400/225',
            location: '공학관',
            category: 'job',
            tags: ['채용', 'IT', '네이버'],
        },
        {
            id: 'n2',
            title: 'AI/ML 스터디 그룹 모집',
            description: '매주 수요일 공학관 세미나실에서 진행됩니다.',
            thumbnail: 'https://picsum.photos/seed/aiml/400/225',
            location: '공학관',
            category: 'club',
            tags: ['동아리', 'AI', '스터디'],
        },
    ],
    humanities: [
        {
            id: 'n3',
            title: '2026 인문학 에세이 공모전',
            description: '인문관에서 시상식이 진행됩니다. 참가 신청하세요!',
            thumbnail: 'https://picsum.photos/seed/essay/400/225',
            location: '인문관',
            category: 'event',
            tags: ['공모전', '에세이', '인문학'],
        },
    ],
    library: [
        {
            id: 'n4',
            title: '토익 특강 신청 안내',
            description: '도서관 3층 세미나실에서 무료 특강이 진행됩니다.',
            thumbnail: 'https://picsum.photos/seed/toeic/400/225',
            location: '중앙도서관',
            category: 'education',
            tags: ['교육', '토익', '특강'],
        },
    ],
    student: [
        {
            id: 'n5',
            title: '봄 축제 자원봉사자 모집',
            description: '학생회관에서 신청 가능합니다. 혜택이 많아요!',
            thumbnail: 'https://picsum.photos/seed/festival/400/225',
            location: '학생회관',
            category: 'event',
            tags: ['축제', '봉사', '학생회'],
        },
    ],
    science: [
        {
            id: 'n6',
            title: '화학 실험 보조원 채용',
            description: '자연과학관 연구실에서 근무합니다.',
            thumbnail: 'https://picsum.photos/seed/chem/400/225',
            location: '자연과학관',
            category: 'job',
            tags: ['채용', '연구', '화학'],
        },
    ],
    art: [
        {
            id: 'n7',
            title: '사진 동아리 신입부원 모집',
            description: '예술관에서 오디션이 진행됩니다.',
            thumbnail: 'https://picsum.photos/seed/photo/400/225',
            location: '예술관',
            category: 'club',
            tags: ['동아리', '사진', '예술'],
        },
    ],
};

// 메인 포스터 데이터
const SAMPLE_POSTERS = [
    {
        id: 1,
        title: '2026 대학생 창업 아이디어 공모전',
        date: '2026.01.15 - 2026.02.28',
        thumbnail: 'https://picsum.photos/seed/contest1/400/533',
        tags: ['취업', '창업'],
        category: 'job',
    },
    {
        id: 2,
        title: '밴드 동아리 "하모니" 신입 부원 모집',
        date: '2026.01.10 - 2026.01.25',
        thumbnail: 'https://picsum.photos/seed/club1/400/533',
        tags: ['동아리', '밴드'],
        category: 'club',
    },
    {
        id: 3,
        title: 'AI/ML 기술 세미나: 딥러닝의 미래',
        date: '2026.01.20',
        thumbnail: 'https://picsum.photos/seed/seminar1/400/533',
        tags: ['교육', 'AI'],
        category: 'education',
    },
    {
        id: 4,
        title: '네이버 2026 상반기 신입 공채',
        date: '2026.01.15 - 2026.02.15',
        thumbnail: 'https://picsum.photos/seed/job1/400/533',
        tags: ['취업', 'IT'],
        category: 'job',
    },
    {
        id: 5,
        title: '봄 축제 준비위원회 모집',
        date: '2026.02.01 - 2026.02.15',
        thumbnail: 'https://picsum.photos/seed/event1/400/533',
        tags: ['학교 행사', '축제'],
        category: 'event',
    },
    {
        id: 6,
        title: '블록체인 기술 세미나',
        date: '2026.02.05',
        thumbnail: 'https://picsum.photos/seed/seminar2/400/533',
        tags: ['교육', '블록체인'],
        category: 'education',
    },
    {
        id: 7,
        title: '카카오 인턴십 프로그램',
        date: '2026.01.20 - 2026.02.10',
        thumbnail: 'https://picsum.photos/seed/job2/400/533',
        tags: ['취업', '인턴'],
        category: 'job',
    },
    {
        id: 8,
        title: '교내 해커톤 대회',
        date: '2026.02.15 - 2026.02.16',
        thumbnail: 'https://picsum.photos/seed/contest2/400/533',
        tags: ['학교 행사', '해커톤'],
        category: 'event',
    },
];

function App() {
    // 온보딩 상태
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [userCategories, setUserCategories] = useState([]);

    // 위치 및 알림 상태
    const [currentLocation, setCurrentLocation] = useState('engineering');
    const [currentNotification, setCurrentNotification] = useState(null);
    const [savedNotifications, setSavedNotifications] = useState([]);

    // 필터 및 모달 상태
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 온보딩 체크
    useEffect(() => {
        const hasCompletedOnboarding = localStorage.getItem('postnet_onboarding_complete');
        if (!hasCompletedOnboarding) {
            setShowOnboarding(true);
        } else {
            const savedCategories = localStorage.getItem('postnet_user_categories');
            if (savedCategories) {
                setUserCategories(JSON.parse(savedCategories));
                setSelectedCategories(JSON.parse(savedCategories));
            }
        }

        // 세션 시작 이벤트
        logEvent('session_start', { timestamp: new Date().toISOString() });
    }, []);

    const handleOnboardingComplete = async (categories) => {
        setShowOnboarding(false);
        setUserCategories(categories);
        setSelectedCategories(categories);

        localStorage.setItem('postnet_onboarding_complete', 'true');
        localStorage.setItem('postnet_user_categories', JSON.stringify(categories));

        // Firebase에 저장
        await saveUserCategories(categories);
        await logEvent('onboarding_completed', { categories });

        // 첫 알림 표시 (1초 후)
        setTimeout(() => {
            showNotificationForLocation(currentLocation, categories);
        }, 1000);
    };

    const showNotificationForLocation = (locationId, categories = userCategories) => {
        const notifications = LOCATION_NOTIFICATIONS[locationId] || [];
        // 사용자 관심 카테고리에 맞는 알림 필터링
        const relevantNotifications = notifications.filter(
            (n) => categories.includes(n.category)
        );

        if (relevantNotifications.length > 0) {
            const randomNotification = relevantNotifications[
                Math.floor(Math.random() * relevantNotifications.length)
            ];
            setCurrentNotification(randomNotification);
            logEvent('notification_shown', {
                notification_id: randomNotification.id,
                location: locationId,
            });
        }
    };

    const handleLocationChange = (location) => {
        setCurrentLocation(location.id);

        // 위치 변경 시 새 알림 표시
        setTimeout(() => {
            showNotificationForLocation(location.id);
        }, 500);
    };

    const handleViewDetail = async (notification) => {
        await incrementReactionCount();
        alert(`"${notification.title}" 상세 페이지로 이동합니다.`);
        setCurrentNotification(null);
    };

    const handleSaveNotification = async (notification) => {
        await incrementReactionCount();
        setSavedNotifications((prev) => [...prev, notification]);
        setCurrentNotification(null);
        alert('보관함에 저장되었습니다!');
    };

    const handleDismissNotification = () => {
        setCurrentNotification(null);
    };

    const handleLogEvent = (eventName, data) => {
        logEvent(eventName, data);
    };

    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((c) => c !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleFeedbackSubmit = async (feedbackData) => {
        await logEvent('feedback_submitted', feedbackData);
        const result = await submitFeedback(feedbackData);
        if (result.success) {
            alert('피드백이 성공적으로 전송되었습니다. 감사합니다!');
        } else {
            alert('피드백 전송에 실패했습니다. 나중에 다시 시도해 주세요.');
        }
    };

    const filteredPosters = useMemo(() => {
        if (selectedCategories.length === 0) {
            return SAMPLE_POSTERS;
        }
        return SAMPLE_POSTERS.filter((poster) =>
            selectedCategories.includes(poster.category)
        );
    }, [selectedCategories]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Onboarding Modal */}
            <OnboardingModal
                isOpen={showOnboarding}
                onComplete={handleOnboardingComplete}
            />

            {/* Main Content */}
            <Header />

            {/* Location Selector */}
            <div className="px-6 py-4 flex justify-center">
                <LocationSelector
                    currentLocation={currentLocation}
                    onLocationChange={handleLocationChange}
                    onLogEvent={handleLogEvent}
                />
            </div>

            <FilterChips
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
            />

            <main className="flex-1">
                <PosterGrid posters={filteredPosters} />
            </main>

            <VisitorCounter />

            {/* Notification Popup */}
            <NotificationPopup
                notification={currentNotification}
                onViewDetail={handleViewDetail}
                onSave={handleSaveNotification}
                onDismiss={handleDismissNotification}
                onLogEvent={handleLogEvent}
            />

            {/* Feedback FAB & Modal */}
            <FeedbackFAB onClick={() => setIsModalOpen(true)} />
            <FeedbackModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFeedbackSubmit}
            />
        </div>
    );
}

export default App;
