import React, { useEffect, useRef, useState } from 'react';
import { Bridge } from '../utils/bridge';
import { getActiveWishTree, generateLuckAction } from '../utils/luck_logic';

// --- CUSTOM INPUT COMPONENTS ---
const DateSelector = ({ value, onChange }) => {
    // Value: YYYY-MM-DD
    const [year, setYear] = useState(value ? value.split('-')[0] : '1990');
    const [month, setMonth] = useState(value ? value.split('-')[1] : '01');
    const [day, setDay] = useState(value ? value.split('-')[2] : '01');

    useEffect(() => {
        onChange(`${year}-${month}-${day}`);
    }, [year, month, day]);

    const years = Array.from({ length: 100 }, (_, i) => 2026 - i);
    const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

    const selectClass = "bg-mystic-900 border border-mystic-600 rounded p-2 text-white text-center appearance-none focus:border-mystic-gold outline-none w-full text-sm";

    return (
        <div className="flex space-x-2">
            <div className="flex-[1.5] relative"><select value={year} onChange={e => setYear(e.target.value)} className={selectClass}>{years.map(y => <option key={y} value={y}>{y}년</option>)}</select></div>
            <div className="flex-1 relative"><select value={month} onChange={e => setMonth(e.target.value)} className={selectClass}>{months.map(m => <option key={m} value={m}>{m}월</option>)}</select></div>
            <div className="flex-1 relative"><select value={day} onChange={e => setDay(e.target.value)} className={selectClass}>{days.map(d => <option key={d} value={d}>{d}일</option>)}</select></div>
        </div>
    );
};

const TimeSelector = ({ value, onChange }) => {
    const [hour, setHour] = useState(value ? value.split(':')[0] : '12');
    const [minute, setMinute] = useState(value ? value.split(':')[1] : '00');
    useEffect(() => { onChange(`${hour}:${minute}`); }, [hour, minute]);
    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
    const selectClass = "bg-mystic-900 border border-mystic-600 rounded p-2 text-white text-center appearance-none focus:border-mystic-gold outline-none w-full text-sm";
    return (
        <div className="flex space-x-2">
            <div className="flex-1 relative"><select value={hour} onChange={e => setHour(e.target.value)} className={selectClass}>{hours.map(h => <option key={h} value={h}>{h}시</option>)}</select></div>
            <div className="flex-1 relative"><select value={minute} onChange={e => setMinute(e.target.value)} className={selectClass}>{minutes.map(m => <option key={m} value={m}>{m}분</option>)}</select></div>
        </div>
    );
};

// --- MAIN COMPONENTS ---
export const RitualInput = ({ userData, setUserData, onSubmit, onCancel }) => {
    // Dynamic Wish Tree State
    const [wishTree, setWishTree] = useState(getActiveWishTree());

    useEffect(() => {
        const handleUpdate = () => setWishTree(getActiveWishTree());
        window.addEventListener('wishTreeUpdated', handleUpdate);
        return () => window.removeEventListener('wishTreeUpdated', handleUpdate);
    }, []);

    const WISH_TREE = wishTree; // Alias

    const [mainCatId, setMainCatId] = useState(() => {
        return (userData.category && userData.category.includes('.'))
            ? userData.category.split('.')[0]
            : 'wealth';
    });

    const handleMainCatChange = (id) => {
        setMainCatId(id);
        const mainCat = WISH_TREE[id];
        if (mainCat && mainCat.items && mainCat.items.length > 0) {
            const firstSub = mainCat.items[0].id;
            setUserData({ ...userData, category: `${id}.${firstSub}` });
        }
    };

    const handleSubCatChange = (subId) => {
        setUserData({ ...userData, category: `${mainCatId}.${subId}` });
    };

    return (
        <div className="min-h-screen flex flex-col p-4 relative z-10 animate-slide-up max-w-lg mx-auto pb-20 safe-area-p pt-12">
            <header className="flex items-center mb-6">
                <button onClick={onCancel} className="text-gray-500 hover:text-white mr-4 p-2">← 취소</button>
                <h2 className="font-korean text-xl text-white">기원 설정 (Setup)</h2>
            </header>

            <div className="space-y-6">
                <div className="space-y-2">
                    <h3 className="text-mystic-gold text-xs font-mono uppercase">Select Art Style</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setUserData({ ...userData, style: 'traditional' })}
                            className={`p-3 rounded-lg border text-left transition-all ${userData.style === 'traditional' ? 'bg-[#e6ce83] border-[#8a0000] text-[#5c0000]' : 'bg-mystic-800 border-mystic-700 text-gray-500'}`}>
                            <div className="font-korean font-bold mb-1">전통 서예</div>
                        </button>
                        <button onClick={() => setUserData({ ...userData, style: 'modern' })}
                            className={`p-3 rounded-lg border text-left transition-all ${userData.style === 'modern' ? 'bg-mystic-900 border-mystic-accent text-mystic-accent shadow-[0_0_8px_#64ffda]' : 'bg-mystic-800 border-mystic-700 text-gray-500'}`}>
                            <div className="font-korean font-bold mb-1">新민화</div>
                        </button>
                    </div>
                </div>

                <div className="space-y-3 bg-mystic-800/50 p-4 rounded-lg border border-mystic-700">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">이름 (한글)</label>
                            <input type="text" value={userData.nameKr} onChange={(e) => setUserData({ ...userData, nameKr: e.target.value })}
                                className="w-full bg-mystic-900 border border-mystic-600 rounded p-2 text-white focus:border-mystic-gold outline-none text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">이름 (한자)</label>
                            <input type="text" value={userData.nameHanja} onChange={(e) => setUserData({ ...userData, nameHanja: e.target.value })}
                                className="w-full bg-mystic-900 border border-mystic-600 rounded p-2 text-white focus:border-mystic-gold outline-none text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">생년월일 / 시간</label>
                        <div className="flex gap-2">
                            <div className="flex-1"><DateSelector value={userData.dob || '1990-01-01'} onChange={(v) => setUserData({ ...userData, dob: v })} /></div>
                            <div className="w-1/3"><TimeSelector value={userData.birthTime || '12:00'} onChange={(v) => setUserData({ ...userData, birthTime: v })} /></div>
                        </div>
                    </div>
                </div>

                <div className="bg-mystic-800/30 p-4 rounded-lg border border-mystic-700 space-y-4">
                    <h3 className="text-white text-sm font-bold flex items-center">
                        <span className="mr-2">🎯</span> 기원 선택 (Wish Goal)
                    </h3>

                    {/* Main Categories Grid (2 Columns) */}
                    <div className="grid grid-cols-2 gap-2">
                        {WISH_TREE && Object.values(WISH_TREE).map((cat) => (
                            <button key={cat.id} onClick={(e) => { e.preventDefault(); handleMainCatChange(cat.id); }}
                                className={`px-3 py-3 rounded-lg border text-sm flex items-center justify-center transition-all ${mainCatId === cat.id
                                    ? `bg-mystic-gold text-black border-mystic-gold font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]`
                                    : 'bg-mystic-900 text-gray-400 border-gray-700 hover:border-gray-500'
                                    }`}>
                                <span className="mr-2 text-lg">{cat.icon}</span>
                                <span>{cat.label.split('(')[0].trim()}</span>
                            </button>
                        ))}

                        {/* Random Button as Last Item */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                const cats = Object.keys(WISH_TREE);
                                if (cats.length === 0) return;
                                const randomCatId = cats[Math.floor(Math.random() * cats.length)];

                                const subItems = WISH_TREE[randomCatId].items;
                                if (!subItems || subItems.length === 0) return;
                                const randomSubId = subItems[Math.floor(Math.random() * subItems.length)].id;

                                setMainCatId(randomCatId);
                                setUserData({ ...userData, category: `${randomCatId}.${randomSubId}` });
                            }}
                            className="px-3 py-3 rounded-lg border border-mystic-gold/50 bg-mystic-gold/10 text-mystic-gold text-sm font-bold flex items-center justify-center hover:bg-mystic-gold hover:text-black transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                        >
                            <span className="mr-2 text-lg">🎲</span>
                            <span>랜덤 선택</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2 mt-2">
                        {WISH_TREE && WISH_TREE[mainCatId] && WISH_TREE[mainCatId].items.map((item) => {
                            const isSelected = userData.category === `${mainCatId}.${item.id}`;
                            return (
                                <button key={item.id} onClick={() => handleSubCatChange(item.id)}
                                    className={`relative p-3 rounded-lg border text-left flex justify-between items-center transition-all ${isSelected
                                        ? 'bg-mystic-800 border-mystic-gold shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                                        : 'bg-mystic-900 border-mystic-700 text-gray-500 hover:bg-mystic-800'
                                        }`}>
                                    <div>
                                        <div className={`font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>{item.label.split('(')[0].trim()}</div>
                                        <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                                    </div>
                                    {isSelected && <span className="text-mystic-gold text-xl">✔</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <button onClick={onSubmit} disabled={!userData.nameKr || !userData.category}
                    className={`w-full py-4 font-bold rounded-lg transition-all text-lg shadow-xl active:scale-[0.98] ${userData.nameKr && userData.category ? 'bg-gradient-to-r from-mystic-gold to-yellow-600 text-black' : 'bg-mystic-800 text-gray-600 cursor-not-allowed'}`}>
                    부적 생성 (Digital Alchemy)
                </button>
            </div>
        </div>
    );
};

export const AlchemyLoader = ({ loadingStage, userData }) => {
    // Determine visuals based on category
    const WISH_TREE = getActiveWishTree();

    const catId = userData.category ? userData.category.split('.')[0] : 'wealth';
    const mainCat = WISH_TREE[catId] || WISH_TREE.wealth;
    const accentColor = mainCat?.visual?.accent || '#FFD700';
    const conceptName = mainCat?.visual?.concept || "개운 의식";

    const steps = [
        "의식 초기화 (Ritual Init)...",
        `사용자[${userData.nameKr}]의 진동수 분석 중...`,
        `${conceptName} 에너지 동기화...`, // Dynamic Concept
        "결핍된 기운(Energy Void) 탐지 및 보정값 산출...",
        userData.style === 'modern' ? "K-Minwha 패턴 생성..." : "전통 한지 텍스처 합성...",
        userData.style === 'modern' ? "홀로그램 영적 각인..." : "붉은 기운(Red Aura) 주입 중...",
        "Soul-Sigil 완성."
    ];
    const currentMsg = steps[Math.min(loadingStage, steps.length - 1)];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black relative z-20 safe-area-p">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-mystic-800 via-black to-black opacity-50"></div>
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                {userData.style === 'modern' ? (
                    <>
                        <div className="absolute inset-0 border-2 rounded-full animate-spin-slow" style={{ borderColor: `${accentColor}4D` }}></div>
                        <div className="absolute inset-8 border-2 border-dashed rounded-full animate-spin" style={{ borderColor: accentColor, animationDuration: '3s' }}></div>
                        <div className="text-4xl animate-pulse">{mainCat?.icon || '🔮'}</div>
                    </>
                ) : (
                    <>
                        <div className="absolute inset-0 border-4 border-[#8a0000]/30 rounded-full animate-ping"></div>
                        <div className="absolute inset-4 border-4 border-[#8a0000] rounded-full animate-spin"></div>
                        <div className="text-4xl animate-pulse">🏮</div>
                    </>
                )}
            </div>
            <div className="text-center px-6 max-w-md z-10">
                <h3 className="font-mono text-sm mb-2 animate-pulse" style={{ color: userData.style === 'modern' ? accentColor : '#e6ce83' }}>
                    {currentMsg}
                </h3>
                <div className="w-full bg-gray-900 h-1 mt-4 rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-1000 ease-linear"
                        style={{
                            width: `${(loadingStage / (steps.length - 1)) * 100}%`,
                            backgroundColor: userData.style === 'modern' ? accentColor : '#8a0000'
                        }}></div>
                </div>
            </div>
        </div>
    );
};

export const TalismanResult = ({ userData, onKeep }) => {
    const WISH_TREE = getActiveWishTree();
    const canvasRef = useRef(null);
    const [luckAction, setLuckAction] = useState(null);

    const [catId, subId] = (userData.category || 'wealth.business').split('.');
    const mainCat = WISH_TREE[catId] || WISH_TREE.wealth; // Fallback
    const subItem = (mainCat.items && mainCat.items.find(i => i.id === subId)) || (mainCat.items && mainCat.items[0]) || { label: 'Unknown', id: 'unknown' };

    useEffect(() => {
        const action = generateLuckAction(catId, subId, userData.nameKr);
        setLuckAction(action);
        drawTalisman(canvasRef.current, userData, mainCat, subItem);
    }, [userData]);

    const drawTalisman = (canvas, data, mainCat, subItem) => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1920;

        if (data.style === 'modern') {
            // --- MODERN K-ART STYLE ---
            const visual = mainCat.visual || {};
            const gradientColors = visual.bgGradient || ['#0f0c29', '#302b63', '#24243e'];
            const accent = visual.accent || '#00ffaa';

            const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
            grad.addColorStop(0, gradientColors[0]);
            grad.addColorStop(0.5, gradientColors[1]);
            grad.addColorStop(1, gradientColors[2]);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 1080, 1920);

            // Grid Lines
            ctx.strokeStyle = `${accent}19`; // Low opacity
            ctx.lineWidth = 2;
            for (let i = 0; i < 1920; i += 60) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(1080, i);
                ctx.stroke();
            }

            // Central Circle / Sigil Container
            ctx.shadowBlur = 40;
            ctx.shadowColor = accent;
            ctx.strokeStyle = accent;
            ctx.lineWidth = 15;
            ctx.beginPath();
            ctx.arc(540, 960, 400, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 80px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(visual.concept || 'HUNTER\'S SIGIL', 540, 300);

            ctx.font = '300 50px sans-serif';
            ctx.fillStyle = accent;
            // Safe split checking
            let subLabel = 'PROTOCOL';
            if (subItem.label) {
                if (subItem.label.includes('(')) {
                    subLabel = subItem.label.split('(')[1].replace(')', '').trim().toUpperCase();
                } else {
                    // Fallback for custom labels without english: use the whole label or first 2 words
                    subLabel = subItem.label.trim().toUpperCase();
                }
            }
            ctx.fillText(`${subLabel} PROTOCOL`, 540, 400);

            // Icon as Sigil
            ctx.font = '600px sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillText(mainCat.icon || '🔮', 540, 1150);

        } else {
            // --- TRADITIONAL STYLE ---
            const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
            grad.addColorStop(0, '#f9eeb6');
            grad.addColorStop(1, '#e8c976');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 1080, 1920);

            // Texture noise
            for (let i = 0; i < 20000; i++) {
                ctx.fillStyle = `rgba(139, 69, 19, ${Math.random() * 0.05})`;
                ctx.fillRect(Math.random() * 1080, Math.random() * 1920, 3, 3);
            }

            ctx.strokeStyle = '#aa1111';
            ctx.lineWidth = 30;
            ctx.strokeRect(60, 60, 960, 1800);

            ctx.fillStyle = '#aa1111';
            ctx.font = 'bold 120px serif';
            ctx.textAlign = 'center';
            ctx.fillText(subItem.label ? subItem.label.split('(')[0] : '기원', 540, 400);

            ctx.font = '50px serif';
            ctx.fillStyle = '#aa2222';
            ctx.fillText(`기원자: ${data.nameKr}`, 540, 550);

            ctx.font = '600px serif';
            ctx.fillStyle = 'rgba(170, 0, 0, 0.7)';
            ctx.fillText("願", 540, 1300);

            ctx.beginPath();
            ctx.arc(540, 1600, 100, 0, Math.PI * 2);
            ctx.strokeStyle = '#cc0000';
            ctx.lineWidth = 10;
            ctx.stroke();
        }
    };

    const shareNarrative = () => {
        const title = luckAction?.title || "운명의 부적";
        alert(`[Narrative Agent]"${title}"\n\n${luckAction?.reasoning}\n\n오늘의 미션: ${luckAction?.telling}\n\n(Copied to Clipboard)`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-6 bg-mystic-900 safe-area-p pt-12 animate-fade-in overflow-y-auto">
            <h2 className="text-white text-xl font-korean mb-4">
                {userData.style === 'modern' ? 'Soul-Sigil Forged' : '부적 생성 완료'}
            </h2>

            <div className="shadow-2xl mb-8 border-4 border-mystic-gold/30 rounded-lg overflow-hidden shrink-0">
                <canvas ref={canvasRef} className="w-[200px] h-[355px]" />
            </div>

            {/* Luck Action Card */}
            {luckAction && (
                <div className="w-full max-w-sm bg-gray-800 border-l-4 rounded-r-lg p-4 mb-8 shadow-lg"
                    style={{ borderColor: mainCat.visual?.accent || '#FFD700' }}>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg" style={{ color: mainCat.visual?.accent || '#FFD700' }}>
                            {luckAction.title}
                        </h3>
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">Daily Mission</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4 italic">"{luckAction.reasoning}"</p>

                    <div className="space-y-2">
                        <div className="flex items-start">
                            <span className="text-blue-400 mr-2 font-bold">[Doing]</span>
                            <span className="text-white text-sm">{luckAction.doing}</span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-pink-400 mr-2 font-bold">[Telling]</span>
                            <span className="text-white text-sm">{luckAction.telling}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-sm space-y-3 pb-8">
                <button onClick={() => onKeep(canvasRef.current.toDataURL())}
                    className="w-full bg-mystic-gold text-black font-bold py-3 rounded-lg hover:bg-white transition">
                    보관함에 저장 (Save)
                </button>
                <button onClick={shareNarrative}
                    className="w-full bg-[#FEE500] text-[#3c1e1e] font-bold py-3 rounded-lg hover:bg-[#ebd400] transition flex justify-center items-center">
                    <span>💬 공유하기 (Share Narrative)</span>
                </button>
            </div>
        </div>
    );
};
