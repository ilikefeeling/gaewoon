import React, { useState, useEffect } from 'react';

const WISH_CATEGORIES = [
    { id: 'exam', label: '시험 (Exam)', icon: '📖' },
    { id: 'contract', label: '계약 (Contract)', icon: '✍️' },
    { id: 'interview', label: '면접 (Interview)', icon: '👔' },
    { id: 'work', label: '업무 (Work)', icon: '💼' },
    { id: 'task', label: '작업 (Task)', icon: '🛠️' },
    { id: 'travel', label: '여행 (Travel)', icon: '✈️' },
    { id: 'buy', label: '구매 (Purchase)', icon: '🛍️' },
    { id: 'sell', label: '판매 (Sale)', icon: '💸' },
    { id: 'love', label: '연애 (Romance)', icon: '❤️' },
    { id: 'date', label: '소개팅 (Blind Date)', icon: '🌹' },
    { id: 'drive', label: '운행 (Driving)', icon: '🚗' },
    { id: 'move', label: '이동 (Moving)', icon: '🚚' },
    { id: 'viral', label: '채널 떡상 (Viral)', icon: '📈' },
];

const StorageView = ({ savedTalismans, onBack, onDelete, onMakePermanent, talismanPrice = 9.99 }) => {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(timer);
    }, []);

    const formatTimeLeft = (expiresAt) => {
        const diff = expiresAt - now;
        if (diff <= 0) return "Expired";
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}시간 ${minutes}분 후 소멸`;
    };

    return (
        <div className="min-h-screen flex flex-col p-4 relative z-10 animate-fade-in max-w-lg mx-auto pb-20 safe-area-p pt-12">
            <header className="flex items-center mb-8 pt-4">
                <button onClick={onBack} className="text-gray-500 hover:text-white mr-4 p-2">← Main</button>
                <h2 className="font-korean text-xl text-white">보관함 (Storage)</h2>
            </header>
            {savedTalismans.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <span className="text-4xl mb-4 opacity-30">📭</span>
                    <p>보관된 부적이 없습니다.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {savedTalismans.map(item => {
                        const isExpired = item.expiresAt < now && !item.isPermanent;
                        const timeLeft = formatTimeLeft(item.expiresAt);

                        if (isExpired) return null;

                        return (
                            <div key={item.id} className="bg-mystic-800 rounded-lg overflow-hidden border border-mystic-700 relative">
                                <div className={`px-4 py-2 text-xs font-mono flex justify-between items-center ${item.isPermanent ? 'bg-mystic-gold text-black font-bold' : 'bg-red-900/30 text-red-300'
                                    }`}>
                                    <span>{item.isPermanent ? 'PERMANENT' : `VOLATILE`}</span>
                                    <span>{!item.isPermanent && timeLeft}</span>
                                </div>
                                <div className="p-4 flex gap-4">
                                    <div className="w-24 h-32 bg-black rounded border border-gray-700 overflow-hidden flex-shrink-0">
                                        <img src={item.imageData} className="w-full h-full object-cover opacity-80" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-white font-korean font-bold text-lg">
                                                {item.style === 'modern' ? '⚡ ' : ''}
                                                {WISH_CATEGORIES.find(c => c.id === item.category)?.label.split(' ')[0]}
                                            </h3>
                                            <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()} 생성</p>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            {!item.isPermanent ? (
                                                <button
                                                    onClick={() => onMakePermanent(item.id)}
                                                    className="flex-1 bg-mystic-gold/20 text-mystic-gold border border-mystic-gold/50 rounded py-2 text-xs font-bold hover:bg-mystic-gold hover:text-black transition"
                                                >
                                                    영구 소장 (${talismanPrice})
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        const link = document.createElement('a');
                                                        link.download = `Soul-Sigil-${item.nameKr}.png`;
                                                        link.href = item.imageData;
                                                        link.click();
                                                    }}
                                                    className="flex-1 bg-white/10 text-white border border-white/20 rounded py-2 text-xs hover:bg-white/20 transition"
                                                >
                                                    다운로드
                                                </button>
                                            )}
                                            <button onClick={() => onDelete(item.id)} className="px-3 bg-gray-800 text-gray-500 rounded py-2 text-xs hover:text-red-400">삭제</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StorageView;
