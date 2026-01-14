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
import ArchiveModal from './components/ArchiveModal';
import { submitFeedback, logEvent, saveUserCategories, incrementReactionCount, incrementUserAction } from './firebase';

// 위치별 샘플 공고 데이터 (연세대 신촌캠퍼스)
const LOCATION_NOTIFICATIONS = {
    engineering: [
        {
            id: 'n1',
            title: '삼성 DS/SDS 2026 상반기 채용설명회',
            description: '공학원 1층 로비에서 진행됩니다. 반도체, SW 직군 채용 안내!',
            thumbnail: 'https://picsum.photos/seed/samsung/400/225',
            location: '공학원',
            category: 'job',
            tags: ['채용', '삼성', 'IT'],
        },
        {
            id: 'n2',
            title: 'YAI 17기 신입부원 모집',
            description: '연세 인공지능학회 YAI 17기 리쿠르팅 중입니다!',
            thumbnail: 'https://picsum.photos/seed/yai/400/225',
            location: '공학원',
            category: 'club',
            tags: ['학회', 'AI', 'YAI'],
        },
    ],
    samsung: [
        {
            id: 'n3',
            title: '관정이종환재단 장학생 모집',
            description: '2026년도 관정재단 국내외 장학생을 모집합니다.',
            thumbnail: 'https://picsum.photos/seed/kwanjeong/400/225',
            location: '삼성학술정보관',
            category: 'scholarship',
            tags: ['장학금', '관정재단', '국내장학'],
        },
        {
            id: 'n4',
            title: 'TOEFL/GRE 무료 특강',
            description: '삼성학술정보관 세미나실에서 무료 특강이 진행됩니다.',
            thumbnail: 'https://picsum.photos/seed/toefl/400/225',
            location: '삼성학술정보관',
            category: 'education',
            tags: ['교육', 'TOEFL', '특강'],
        },
    ],
    baekyang: [
        {
            id: 'n5',
            title: '아카라카 2026 자원봉사자 모집',
            description: '백양누리에서 신청 가능합니다. 혜택이 많아요!',
            thumbnail: 'https://picsum.photos/seed/akaraka/400/225',
            location: '백양누리',
            category: 'event',
            tags: ['축제', '아카라카', '봉사'],
        },
        {
            id: 'n6',
            title: '혼성합창동아리 아브낭뜨 신입부원 모집',
            description: '백양누리 그랜드볼룸에서 오디션이 진행됩니다.',
            thumbnail: 'https://picsum.photos/seed/abnante/400/225',
            location: '백양누리',
            category: 'club',
            tags: ['동아리', '합창', '아브낭뜨'],
        },
    ],
    student: [
        {
            id: 'n7',
            title: '중앙수영동아리 물사랑 신입부원 모집',
            description: '학생회관에서 신청하세요. 수영 초보도 환영!',
            thumbnail: 'https://picsum.photos/seed/swimming/400/225',
            location: '학생회관',
            category: 'club',
            tags: ['동아리', '수영', '물사랑'],
        },
        {
            id: 'n8',
            title: '복싱동아리 Yonsei Boxer 신입부원 모집',
            description: '학생회관 동아리실에서 활동합니다.',
            thumbnail: 'https://picsum.photos/seed/boxing/400/225',
            location: '학생회관',
            category: 'club',
            tags: ['동아리', '복싱', 'Yonsei Boxer'],
        },
    ],
    science: [
        {
            id: 'n9',
            title: 'SK하이닉스 2026 채용연계형 인턴',
            description: '과학관에서 채용설명회가 진행됩니다.',
            thumbnail: 'https://picsum.photos/seed/skhynix/400/225',
            location: '과학관',
            category: 'job',
            tags: ['채용', 'SK하이닉스', '인턴'],
        },
    ],
    yongjae: [
        {
            id: 'n10',
            title: '국가정보원 5급 공채 설명회',
            description: '용재홀에서 국정원 채용설명회가 열립니다.',
            thumbnail: 'https://picsum.photos/seed/nis/400/225',
            location: '용재홀',
            category: 'job',
            tags: ['채용', '국정원', '공무원'],
        },
        {
            id: 'n11',
            title: '삼송장학재단 장학생 모집',
            description: '용재홀에서 장학 설명회가 진행됩니다.',
            thumbnail: 'https://picsum.photos/seed/samsong/400/225',
            location: '용재홀',
            category: 'scholarship',
            tags: ['장학금', '삼송재단'],
        },
    ],
};

// 메인 포스터 데이터 (연세대 신촌캠퍼스)
const SAMPLE_POSTERS = [
    // 동아리 & 학회
    {
        id: 1,
        title: 'YAI 17기 신입부원 모집',
        date: '2026.01.15 - 2026.02.10',
        thumbnail: 'https://picsum.photos/seed/yai17/400/533',
        tags: ['학회', 'AI', 'ML'],
        category: 'club',
    },
    {
        id: 2,
        title: '중앙 사진동아리 연영회 신입부원 모집',
        date: '2026.01.10 - 2026.01.31',
        thumbnail: 'https://picsum.photos/seed/photo/400/533',
        tags: ['동아리', '사진'],
        category: 'club',
    },
    {
        id: 3,
        title: '공대 자작자동차 동아리 MECar 모집',
        date: '2026.01.20 - 2026.02.15',
        thumbnail: 'https://picsum.photos/seed/mecar/400/533',
        tags: ['동아리', '공학', '자동차'],
        category: 'club',
    },
    {
        id: 4,
        title: '기타 동아리 오르페우스 신입부원 모집',
        date: '2026.01.15 - 2026.02.05',
        thumbnail: 'https://picsum.photos/seed/guitar/400/533',
        tags: ['동아리', '기타', '음악'],
        category: 'club',
    },
    // 채용
    {
        id: 5,
        title: '국가정보원 5급 공채',
        date: '2026.01.15 - 2026.02.28',
        thumbnail: 'https://picsum.photos/seed/nisjob/400/533',
        tags: ['채용', '국정원', '공무원'],
        category: 'job',
    },
    {
        id: 6,
        title: '현대모비스 2025 겨울 장학전환 인턴',
        date: '2026.01.10 - 2026.01.31',
        thumbnail: 'https://picsum.photos/seed/mobis/400/533',
        tags: ['채용', '현대', '인턴'],
        category: 'job',
    },
    {
        id: 7,
        title: '삼성 DS/SDS 2026 상반기 신입공채',
        date: '2026.01.20 - 2026.02.20',
        thumbnail: 'https://picsum.photos/seed/samsungjob/400/533',
        tags: ['채용', '삼성', 'IT'],
        category: 'job',
    },
    {
        id: 8,
        title: 'SK하이닉스 2026 채용연계형 인턴',
        date: '2026.01.15 - 2026.02.10',
        thumbnail: 'https://picsum.photos/seed/skhynixjob/400/533',
        tags: ['채용', 'SK', '반도체'],
        category: 'job',
    },
    {
        id: 9,
        title: 'HD현대 2026 상반기 신입사원 채용',
        date: '2026.01.20 - 2026.02.15',
        thumbnail: 'https://picsum.photos/seed/hdhyundai/400/533',
        tags: ['채용', 'HD현대', '조선'],
        category: 'job',
    },
    // 장학
    {
        id: 10,
        title: '기계공학부 ME Graduate Fellowship (MGF)',
        date: '2026.01.01 - 2026.02.28',
        thumbnail: 'https://picsum.photos/seed/mgf/400/533',
        tags: ['장학금', '기계공학', '대학원'],
        category: 'scholarship',
    },
    {
        id: 11,
        title: '삼송장학재단 2026년도 장학생 모집',
        date: '2026.01.15 - 2026.02.20',
        thumbnail: 'https://picsum.photos/seed/samsongsch/400/533',
        tags: ['장학금', '삼송재단'],
        category: 'scholarship',
    },
    {
        id: 12,
        title: '관정이종환재단 2026 국내장학생 모집',
        date: '2026.01.10 - 2026.03.10',
        thumbnail: 'https://picsum.photos/seed/kwanjeongsch/400/533',
        tags: ['장학금', '관정재단', '전액장학'],
        category: 'scholarship',
    },
    // 행사
    {
        id: 13,
        title: '아카라카 2026 축제 준비위원 모집',
        date: '2026.03.01 - 2026.03.15',
        thumbnail: 'https://picsum.photos/seed/akarakafest/400/533',
        tags: ['축제', '아카라카'],
        category: 'event',
    },
    // 교육
    {
        id: 14,
        title: 'AWS 클라우드 자격증 특강',
        date: '2026.02.01 - 2026.02.10',
        thumbnail: 'https://picsum.photos/seed/awslecture/400/533',
        tags: ['교육', 'AWS', '자격증'],
        category: 'education',
    },
];

function App() {
    // 온보딩 상태
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [userCategories, setUserCategories] = useState([]);

    // 위치 및 알림 상태 (다중 선택)
    const [selectedLocations, setSelectedLocations] = useState(['engineering']);
    const [currentNotification, setCurrentNotification] = useState(null);
    const [savedNotifications, setSavedNotifications] = useState([]);

    // 보관함 상태 (포스터)
    const [savedPosters, setSavedPosters] = useState([]);
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);

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

    const handleOnboardingComplete = async (categories, userInfo = {}) => {
        setShowOnboarding(false);
        setUserCategories(categories);
        setSelectedCategories(categories);

        localStorage.setItem('postnet_onboarding_complete', 'true');
        localStorage.setItem('postnet_user_categories', JSON.stringify(categories));

        // 학년과 단과대학 정보도 저장
        if (userInfo.grade) {
            localStorage.setItem('postnet_user_grade', userInfo.grade);
        }
        if (userInfo.college) {
            localStorage.setItem('postnet_user_college', userInfo.college);
        }

        // Firebase에 저장
        await saveUserCategories(categories);
        await logEvent('onboarding_completed', {
            categories,
            grade: userInfo.grade,
            college: userInfo.college
        });

        // 첫 알림 표시 (1초 후)
        setTimeout(() => {
            showNotificationForLocations(selectedLocations, categories);
        }, 1000);
    };

    const showNotificationForLocations = (locationIds, categories = userCategories) => {
        // 선택된 모든 위치에서 알림 수집
        let allNotifications = [];
        locationIds.forEach((locationId) => {
            const notifications = LOCATION_NOTIFICATIONS[locationId] || [];
            allNotifications = [...allNotifications, ...notifications];
        });

        // 사용자 관심 카테고리에 맞는 알림 필터링
        const relevantNotifications = allNotifications.filter(
            (n) => categories.includes(n.category)
        );

        if (relevantNotifications.length > 0) {
            const randomNotification = relevantNotifications[
                Math.floor(Math.random() * relevantNotifications.length)
            ];
            setCurrentNotification(randomNotification);
            logEvent('notification_shown', {
                notification_id: randomNotification.id,
                locations: locationIds,
            });
        }
    };

    const handleLocationToggle = (location) => {
        setSelectedLocations((prev) => {
            const newLocations = prev.includes(location.id)
                ? prev.filter((id) => id !== location.id)
                : [...prev, location.id];

            // 위치 변경 시 새 알림 표시
            if (newLocations.length > 0 && !prev.includes(location.id)) {
                setTimeout(() => {
                    showNotificationForLocations(newLocations);
                }, 500);
            }

            return newLocations;
        });
    };

    const handleViewDetail = async (notification) => {
        await incrementReactionCount();
        // 해당 카테고리로 필터 설정 (alert 없이)
        setSelectedCategories([notification.category]);
        setCurrentNotification(null);

        logEvent('view_detail_navigated', {
            notification_id: notification.id,
            category: notification.category,
        });
    };

    const handleSaveNotification = async (notification) => {
        await incrementReactionCount();
        // 중복 체크
        if (!savedNotifications.find((n) => n.id === notification.id)) {
            setSavedNotifications((prev) => [...prev, notification]);
        }
        setCurrentNotification(null);
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

    // 포스터 저장 핸들러
    const handleSavePoster = (poster) => {
        setSavedPosters((prev) => {
            const isAlreadySaved = prev.find((p) => p.id === poster.id);
            if (isAlreadySaved) {
                // 이미 저장되어 있으면 제거 (토글)
                return prev.filter((p) => p.id !== poster.id);
            } else {
                // 저장
                logEvent('poster_saved', { poster_id: poster.id, title: poster.title });
                return [...prev, poster];
            }
        });
    };

    // 보관함에서 아이템 제거
    const handleRemoveFromArchive = (itemId) => {
        // 알림에서 제거
        setSavedNotifications((prev) => prev.filter((n) => n.id !== itemId));
        // 포스터에서 제거
        setSavedPosters((prev) => prev.filter((p) => p.id !== itemId));
    };

    // 보관함 바로가기 (카테고리로 이동)
    const handleMoveFromArchive = (item) => {
        setSelectedCategories([item.category]);
        setIsArchiveOpen(false);
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

    // 보관함 내용 통합 (알림 + 포스터)
    const allSavedItems = useMemo(() => {
        return [...savedNotifications, ...savedPosters];
    }, [savedNotifications, savedPosters]);

    const savedPosterIds = useMemo(() => {
        return savedPosters.map((p) => p.id);
    }, [savedPosters]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Onboarding Modal */}
            <OnboardingModal
                isOpen={showOnboarding}
                onComplete={handleOnboardingComplete}
            />

            {/* Main Content */}
            <Header
                onArchiveClick={() => setIsArchiveOpen(true)}
                savedCount={allSavedItems.length}
            />

            {/* Location Selector */}
            <div className="px-6 py-4 flex justify-center">
                <LocationSelector
                    selectedLocations={selectedLocations}
                    onLocationToggle={handleLocationToggle}
                    onLogEvent={handleLogEvent}
                />
            </div>

            <FilterChips
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
            />

            <main className="flex-1">
                <PosterGrid
                    posters={filteredPosters}
                    onSavePoster={handleSavePoster}
                    savedPosterIds={savedPosterIds}
                />
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

            {/* Archive Modal */}
            <ArchiveModal
                isOpen={isArchiveOpen}
                onClose={() => setIsArchiveOpen(false)}
                savedNotifications={allSavedItems}
                onMove={handleMoveFromArchive}
                onRemove={handleRemoveFromArchive}
            />

            {/* Feedback FAB & Modal */}
            <FeedbackFAB onClick={() => {
                incrementUserAction('feedback_modal_open');
                setIsModalOpen(true);
            }} />
            <FeedbackModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFeedbackSubmit}
            />
        </div>
    );
}

export default App;

