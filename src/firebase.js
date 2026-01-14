// Firebase 설정 파일
// 아래 firebaseConfig에 본인의 Firebase 프로젝트 설정을 입력하세요.

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase 프로젝트 설정
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 방문자 수 증가 함수
export const incrementVisitorCount = async () => {
    try {
        const statsRef = doc(db, 'stats', 'visitors');
        const statsDoc = await getDoc(statsRef);

        if (statsDoc.exists()) {
            await updateDoc(statsRef, {
                count: increment(1)
            });
        } else {
            // 문서가 없으면 생성
            await setDoc(statsRef, {
                count: 1
            });
        }
    } catch (error) {
        console.error('방문자 수 업데이트 오류:', error);
    }
};

// 방문자 수 가져오기
export const getVisitorCount = async () => {
    try {
        const statsRef = doc(db, 'stats', 'visitors');
        const statsDoc = await getDoc(statsRef);

        if (statsDoc.exists()) {
            return statsDoc.data().count;
        }
        return 0;
    } catch (error) {
        console.error('방문자 수 조회 오류:', error);
        return 0;
    }
};

// 피드백 저장 함수
export const submitFeedback = async (feedbackData) => {
    try {
        const feedbacksRef = collection(db, 'feedbacks');
        await addDoc(feedbacksRef, {
            ...feedbackData,
            createdAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('피드백 저장 오류:', error);
        return { success: false, error };
    }
};

// 이벤트 로깅 함수 (가설 검증용)
export const logEvent = async (eventName, eventData = {}) => {
    try {
        const eventsRef = collection(db, 'events');
        const userId = getUserId();

        await addDoc(eventsRef, {
            eventName,
            eventData,
            userId,
            sessionId: getSessionId(),
            createdAt: serverTimestamp()
        });

        console.log(`[Event] ${eventName}:`, eventData);
        return { success: true };
    } catch (error) {
        console.error('이벤트 로깅 오류:', error);
        return { success: false, error };
    }
};

// 사용자 ID 관리 (localStorage 기반)
const getUserId = () => {
    let userId = localStorage.getItem('postnet_user_id');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('postnet_user_id', userId);
    }
    return userId;
};

// 세션 ID 관리
const getSessionId = () => {
    let sessionId = sessionStorage.getItem('postnet_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('postnet_session_id', sessionId);
    }
    return sessionId;
};

// 사용자 반응 횟수 저장 (재반응률 측정용)
export const incrementReactionCount = async () => {
    try {
        const userId = getUserId();
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            await updateDoc(userRef, {
                reactionCount: increment(1),
                lastReactionAt: serverTimestamp()
            });
        } else {
            await setDoc(userRef, {
                reactionCount: 1,
                firstVisitAt: serverTimestamp(),
                lastReactionAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('반응 횟수 업데이트 오류:', error);
    }
};

// 온보딩 카테고리 저장
export const saveUserCategories = async (categories) => {
    try {
        const userId = getUserId();
        const userRef = doc(db, 'users', userId);

        await setDoc(userRef, {
            selectedCategories: categories,
            onboardingCompletedAt: serverTimestamp()
        }, { merge: true });

        return { success: true };
    } catch (error) {
        console.error('카테고리 저장 오류:', error);
        return { success: false, error };
    }
};

// 사용자 행동 추적 함수 (Pre-Launch 검증용)
// stats/user_actions 문서에 각 행동을 카운팅
export const incrementUserAction = async (actionType, actionName = null) => {
    try {
        const actionsRef = doc(db, 'stats', 'user_actions');
        const actionsDoc = await getDoc(actionsRef);

        // 필드 이름 결정
        let fieldName;
        switch (actionType) {
            case 'category_click':
                // 카테고리별로 별도 필드 (예: category_job, category_scholarship)
                fieldName = `category_${actionName}`;
                break;
            case 'poster_detail_view':
                fieldName = '포스터_상세_조회';
                break;
            case 'feedback_modal_open':
                fieldName = '피드백_창_열림';
                break;
            default:
                fieldName = actionType;
        }

        if (actionsDoc.exists()) {
            await updateDoc(actionsRef, {
                [fieldName]: increment(1),
                lastUpdated: serverTimestamp()
            });
        } else {
            // 문서가 없으면 생성
            await setDoc(actionsRef, {
                [fieldName]: 1,
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            });
        }

        console.log(`[UserAction] ${fieldName} incremented`);
        return { success: true };
    } catch (error) {
        console.error('사용자 행동 추적 오류:', error);
        return { success: false, error };
    }
};

// 연속 반응 (스트릭) 추적 함수
export const getAndUpdateStreak = async () => {
    try {
        const userId = getUserId();
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        const now = new Date();
        let currentStreak = 1;

        if (userDoc.exists()) {
            const data = userDoc.data();
            const lastReaction = data.lastReactionAt?.toDate();

            // 마지막 반응이 30분 이내이면 스트릭 증가
            if (lastReaction && (now - lastReaction) < 30 * 60 * 1000) {
                currentStreak = (data.currentStreak || 0) + 1;
            }

            await updateDoc(userRef, {
                currentStreak,
                lastReactionAt: serverTimestamp(),
                maxStreak: Math.max(data.maxStreak || 0, currentStreak)
            });
        } else {
            await setDoc(userRef, {
                currentStreak: 1,
                lastReactionAt: serverTimestamp(),
                maxStreak: 1
            });
        }

        console.log(`[Streak] Current streak: ${currentStreak}`);
        return { success: true, streak: currentStreak };
    } catch (error) {
        console.error('스트릭 업데이트 오류:', error);
        return { success: false, streak: 0, error };
    }
};

// 👍/👎 피드백 로깅 함수
export const logHelpfulFeedback = async (notificationId, isHelpful) => {
    try {
        const userId = getUserId();
        const feedbackRef = collection(db, 'helpfulness_feedback');

        await addDoc(feedbackRef, {
            userId,
            notificationId,
            isHelpful,
            createdAt: serverTimestamp()
        });

        // 통계 업데이트
        const statsRef = doc(db, 'stats', 'helpfulness');
        const statsDoc = await getDoc(statsRef);
        const fieldName = isHelpful ? 'helpful_count' : 'not_helpful_count';

        if (statsDoc.exists()) {
            await updateDoc(statsRef, {
                [fieldName]: increment(1),
                lastUpdated: serverTimestamp()
            });
        } else {
            await setDoc(statsRef, {
                helpful_count: isHelpful ? 1 : 0,
                not_helpful_count: isHelpful ? 0 : 1,
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            });
        }

        console.log(`[Feedback] ${isHelpful ? '👍 Helpful' : '👎 Not helpful'} logged`);
        return { success: true };
    } catch (error) {
        console.error('피드백 로깅 오류:', error);
        return { success: false, error };
    }
};

// UTM 소스 트래킹 함수
export const trackUTMSource = async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');

        // UTM 파라미터가 없으면 건너뛰기
        if (!utmSource && !utmMedium && !utmCampaign) {
            return { success: true, tracked: false };
        }

        const userId = getUserId();
        const sessionId = getSessionId();

        // UTM 데이터 저장
        const utmRef = collection(db, 'utm_tracking');
        await addDoc(utmRef, {
            userId,
            sessionId,
            utm_source: utmSource || null,
            utm_medium: utmMedium || null,
            utm_campaign: utmCampaign || null,
            referrer: document.referrer || null,
            createdAt: serverTimestamp()
        });

        // 통계 업데이트
        if (utmSource) {
            const statsRef = doc(db, 'stats', 'utm_sources');
            const statsDoc = await getDoc(statsRef);
            const fieldName = `source_${utmSource}`;

            if (statsDoc.exists()) {
                await updateDoc(statsRef, {
                    [fieldName]: increment(1),
                    lastUpdated: serverTimestamp()
                });
            } else {
                await setDoc(statsRef, {
                    [fieldName]: 1,
                    createdAt: serverTimestamp(),
                    lastUpdated: serverTimestamp()
                });
            }
        }

        console.log(`[UTM] Tracked: source=${utmSource}, medium=${utmMedium}, campaign=${utmCampaign}`);
        return { success: true, tracked: true, utmSource, utmMedium, utmCampaign };
    } catch (error) {
        console.error('UTM 트래킹 오류:', error);
        return { success: false, error };
    }
};

export { db };

