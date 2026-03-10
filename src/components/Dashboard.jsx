import React, { useState, useEffect } from 'react';
import { Bridge } from '../utils/bridge';

const LiveHunters = () => {
    const [count, setCount] = useState(1240);
    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => prev + Math.floor(Math.random() * 5) - 2);
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="flex items-center space-x-2 text-xs font-mono text-mystic-accent bg-mystic-900/80 px-3 py-1 rounded-full border border-mystic-accent/30 animate-pulse-slow">
            <span className="w-2 h-2 bg-mystic-accent rounded-full animate-ping"></span>
            <span>Active Hunters: {count.toLocaleString()}</span>
        </div>
    );
};

const WeatherWidget = () => {
    const weathers = [
        { icon: '☀️', desc: 'Clear: Fire Energy Peak', tip: '적극적인 행동이 필요한 시기' },
        { icon: '☁️', desc: 'Cloudy: Water Energy Flow', tip: '내면을 관조하기 좋은 시간' },
        { icon: '🌧️', desc: 'Rain: Wood Growth', tip: '새로운 시작을 위한 정화' },
    ];
    const [weather, setWeather] = useState(weathers[0]);
    useEffect(() => {
        setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
    }, []);
    return (
        <div className="flex items-center space-x-3 bg-mystic-800/40 p-3 rounded-lg border border-mystic-700/50 mb-4 animate-fade-in">
            <span className="text-2xl">{weather.icon}</span>
            <div className="text-xs">
                <div className="text-white font-mono">{weather.desc}</div>
                <div className="text-gray-400">{weather.tip}</div>
            </div>
        </div>
    );
};

const Dashboard = ({ onStartCreate, onGoStorage, lPoints, isLimitReached, streak }) => {
    useEffect(() => {
        console.log("Dashboard Mounted (Success)"); // Debug Log
        // Example: Vibrate on dashboard load using bridge
        Bridge.vibrate(100);
    }, []);

    return (
        <div className="min-h-screen flex flex-col p-6 relative z-10 animate-fade-in max-w-lg mx-auto safe-area-p pt-12">
            <header className="flex justify-between items-center mb-8 border-b border-mystic-gold/20 pb-4">
                <div>
                    <div className="font-serif text-2xl text-white">Hunter's Sigil</div>
                    <LiveHunters />
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-xs font-mono text-mystic-accent mb-1">ONLINE</div>
                    <div className="bg-mystic-gold/10 px-2 py-1 rounded border border-mystic-gold/30">
                        <span className="text-mystic-gold text-xs font-bold mr-1">💎</span>
                        <span className="text-white text-xs font-mono">{lPoints} P</span>
                    </div>
                </div>
            </header>

            <WeatherWidget />

            <div className="bg-mystic-800/60 p-6 rounded-xl border border-mystic-700 mb-8 backdrop-blur-sm relative overflow-hidden group hover:border-mystic-gold/50 transition-colors cursor-pointer active:scale-[0.98]">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-6xl">🔥</span>
                </div>
                <h3 className="text-mystic-gold font-mono text-xs uppercase mb-2">Ritual Continuity</h3>
                <div className="flex items-end space-x-2">
                    <span className="text-4xl font-bold text-white">{streak}</span>
                    <span className="text-sm text-gray-400 mb-2">일 연속 달성 (Day Streak)</span>
                </div>
                <div className="w-full bg-gray-700 h-1 mt-4 rounded-full">
                    <div className="bg-mystic-gold h-1 rounded-full transition-all duration-1000" style={{ width: `${Math.min(streak * 10, 100)}%` }}></div>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    onClick={onStartCreate}
                    disabled={isLimitReached}
                    className={`w-full py-6 rounded-lg border flex items-center justify-between px-6 transition-all group active:scale-[0.98] ${isLimitReached
                        ? 'bg-mystic-900 border-gray-800 text-gray-600 cursor-not-allowed'
                        : 'bg-mystic-gold/10 border-mystic-gold text-white hover:bg-mystic-gold/20 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                        }`}
                >
                    <div>
                        <div className="font-korean font-bold text-lg text-left">새 부적 생성</div>
                        <div className="text-xs text-gray-500 text-left font-mono mt-1">Initiate New Ritual (+100 L-Point)</div>
                    </div>
                    <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <button
                    onClick={onGoStorage}
                    className="w-full py-6 rounded-lg border border-mystic-700 bg-mystic-800/40 text-gray-400 flex items-center justify-between px-6 hover:bg-mystic-800 hover:text-white transition-colors active:scale-[0.98]"
                >
                    <div>
                        <div className="font-korean font-bold text-lg text-left">보관함</div>
                        <div className="text-xs text-gray-500 text-left font-mono mt-1">Soul-Sigil Storage</div>
                    </div>
                    <span className="text-xl">📂</span>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
