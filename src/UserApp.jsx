import React, { useState, useEffect } from 'react';
import { auth, firestore, signInAnonymously } from './firebase';
import { doc, getDoc, setDoc, enableNetwork } from 'firebase/firestore';
import ParticleBackground from './components/ParticleBackground';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import StorageView from './components/StorageView';
import PaymentCheckout from './components/PaymentCheckout';
import { RitualInput, AlchemyLoader, TalismanResult } from './components/TalismanFeatures';
import { scheduleLuckyTimeNotification } from './utils/notification';
import { useNavigate } from 'react-router-dom';

// --- Constants ---
const IS_DEV_MODE = true; // In prod, set to false
const EXEPIRE_MS = 24 * 60 * 60 * 1000;

function UserApp() {
    const [view, setView] = useState('login');
    console.log("UserApp Render | View:", view); // Debug Log
    const [userData, setUserData] = useState({
        nameKr: '', nameHanja: '', dob: '', birthTime: '', gender: 'male', category: '', style: 'traditional'
    });
    const [loadingStage, setLoadingStage] = useState(0);
    const [savedTalismans, setSavedTalismans] = useState([]);
    const [lPoints, setLPoints] = useState(0);
    const [paymentModal, setPaymentModal] = useState({ show: false, talismanId: null });
    const [dynamicPrice] = useState(import.meta.env.VITE_TALISMAN_PRICE || '9.99');
    const navigate = useNavigate();

    // --- Helpers ---
    const updateStreak = () => {
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem('gaewoon_last_visit');
        let streak = parseInt(localStorage.getItem('gaewoon_streak') || '0');

        if (lastVisit === today) {
            // Already visited separate logic if needed
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastVisit === yesterday.toDateString()) {
                streak += 1;
            } else {
                streak = 1;
            }
            localStorage.setItem('gaewoon_last_visit', today);
            localStorage.setItem('gaewoon_streak', streak.toString());
        }
        return streak;
    };

    const checkDailyLimit = () => {
        if (IS_DEV_MODE) return false;
        const today = new Date().toDateString();
        const lastGenerated = localStorage.getItem('gaewoon_last_generated_date');
        return lastGenerated === today;
    };

    const setDailyLimit = () => {
        if (IS_DEV_MODE) return;
        const today = new Date().toDateString();
        localStorage.setItem('gaewoon_last_generated_date', today);
    };

    // --- Effects ---
    useEffect(() => {
        // Load Data
        const loaded = JSON.parse(localStorage.getItem('gaewoon_talismans') || '[]');
        const points = parseInt(localStorage.getItem('gaewoon_l_points') || '0');
        const now = Date.now();
        const valid = loaded.filter(item => item.isPermanent || item.expiresAt > now);

        setSavedTalismans(valid);
        setLPoints(points);
        localStorage.setItem('gaewoon_talismans', JSON.stringify(valid));

        updateStreak();

        // Init Kakao SDK
        if (window.Kakao && !window.Kakao.isInitialized() && import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY) {
            window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
        }
    }, []);

    useEffect(() => {
        if (view !== 'login') {
            localStorage.setItem('gaewoon_talismans', JSON.stringify(savedTalismans));
        }
    }, [savedTalismans]);

    // --- Handlers ---
    const handleLogin = async () => {
        // Dev Bypass or No Key
        if (!import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY) {
            console.warn("No Kakao Key found, bypassing login for DEV");
            updateStreak();
            await scheduleLuckyTimeNotification();
            setTimeout(() => setView('dashboard'), 800);
            return;
        }

        if (!window.Kakao || !window.Kakao.isInitialized()) {
            alert("Kakao SDK not initialized");
            return;
        }

        window.Kakao.Auth.login({
            success: function (authObj) {
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: async function (res) {
                        try {
                            const kakaoId = res.id;
                            const nickname = res.properties?.nickname;
                            console.log("Kakao Login Success:", kakaoId, nickname);

                            const { user } = await signInAnonymously(auth);
                            console.log("Firebase Anon Login Success:", user.uid);

                            // Fire-and-forget Firestore Sync (Background)
                            const syncPromise = (async () => {
                                try {
                                    const userRef = doc(firestore, "users", kakaoId.toString());
                                    const userSnap = await getDoc(userRef);
                                    if (!userSnap.exists()) {
                                        await setDoc(userRef, {
                                            kakaoId,
                                            nickname: nickname || 'Guest',
                                            firebaseUid: user.uid,
                                            createdAt: new Date(),
                                            lPoints: 0,
                                            tier: 'free'
                                        });
                                    } else {
                                        await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
                                    }
                                    console.log("Background Firestore Sync Success");
                                } catch (err) {
                                    console.warn("Background Firestore Sync Failed (Non-critical):", err);
                                }
                            })();

                            updateStreak();
                            await scheduleLuckyTimeNotification();

                            // Proceed immediately without waiting for DB
                            setTimeout(() => {
                                setView('dashboard');
                            }, 800);

                        } catch (e) {
                            console.error("Firebase Login Fatal Error", e);
                            alert("Login Error: " + e.message);
                        }
                    },
                    fail: function (error) {
                        alert("Kakao User Info Error: " + JSON.stringify(error));
                    },
                });
            },
            fail: function (err) {
                alert("Kakao Login Failed: " + JSON.stringify(err));
            },
        });
    };

    const startCreation = () => {
        setUserData({ nameKr: '', nameHanja: '', dob: '', birthTime: '', gender: 'male', category: '', style: 'traditional' });
        setView('input');
    };

    const submitRitual = () => {
        setView('alchemy');
        let stage = 0;
        const interval = setInterval(() => {
            stage++;
            setLoadingStage(stage);
            if (stage >= 6) {
                clearInterval(interval);
                setTimeout(() => {
                    setDailyLimit();
                    updateStreak();
                    const newPoints = lPoints + 100;
                    setLPoints(newPoints);
                    localStorage.setItem('gaewoon_l_points', newPoints.toString());
                    setView('result');
                }, 1000);
            }
        }, 1200);
    };

    const handleKeep = (imageData) => {
        const newTalisman = {
            id: Date.now().toString(),
            ...userData,
            imageData,
            createdAt: Date.now(),
            expiresAt: Date.now() + EXEPIRE_MS,
            isPermanent: false
        };
        setSavedTalismans(prev => [newTalisman, ...prev]);
        alert('보관함에 저장되었습니다. (24시간 유효)');
        setView('storage');
    };

    const handleMakePermanent = (id) => {
        setPaymentModal({ show: true, talismanId: id });
    };

    const onPaymentSuccess = async () => {
        if (!paymentModal.talismanId) return;

        setSavedTalismans(prev => prev.map(item =>
            item.id === paymentModal.talismanId ? { ...item, isPermanent: true, expiresAt: null } : item
        ));

        // Firestore update if logged in
        if (auth.currentUser) {
            const userRef = doc(firestore, "users", auth.currentUser.uid || "anon");
            // In a real app, you'd sync this specific talisman's permanent status to Firestore subcollection
            console.log("Synced to Firestore (simulated for MVP)");
        }

        alert('결제가 완료되었습니다. 해당 부적이 영구 보존됩니다.');
        setPaymentModal({ show: false, talismanId: null });
    };

    const handleDelete = (id) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            setSavedTalismans(prev => prev.filter(t => t.id !== id));
        }
    };

    // --- Render ---
    return (
        <div className="relative">
            <ParticleBackground />

            {/* Hidden Admin Link for Demo */}
            <div className="absolute top-0 left-0 p-2 z-50 opacity-50 hover:opacity-100 transition-opacity">
                <button
                    onClick={() => navigate('/admin')}
                    className="bg-red-900/50 text-white text-[10px] px-2 py-1 rounded border border-red-500"
                >
                    ADMIN
                </button>
            </div>

            {view === 'login' && <LoginScreen onLogin={handleLogin} />}

            {view === 'dashboard' && (
                <Dashboard
                    onStartCreate={startCreation}
                    onGoStorage={() => setView('storage')}
                    lPoints={lPoints}
                    isLimitReached={checkDailyLimit()}
                    streak={parseInt(localStorage.getItem('gaewoon_streak') || '0')}
                />
            )}

            {view === 'storage' && (
                <StorageView
                    savedTalismans={savedTalismans}
                    onBack={() => setView('dashboard')}
                    onDelete={handleDelete}
                    onMakePermanent={handleMakePermanent}
                    talismanPrice={dynamicPrice}
                />
            )}

            {view === 'input' && (
                <RitualInput
                    userData={userData}
                    setUserData={setUserData}
                    onSubmit={submitRitual}
                    onCancel={() => setView('dashboard')}
                />
            )}

            {view === 'alchemy' && <AlchemyLoader loadingStage={loadingStage} userData={userData} />}

            {view === 'result' && <TalismanResult userData={userData} onKeep={handleKeep} />}

            {paymentModal.show && (
                <PaymentCheckout
                    amount={dynamicPrice}
                    description="Permanent Talisman Storage"
                    userId={auth.currentUser?.uid || 'guest'}
                    onSuccess={onPaymentSuccess}
                    onClose={() => setPaymentModal({ show: false, talismanId: null })}
                />
            )}
        </div>
    );
}

export default UserApp;
