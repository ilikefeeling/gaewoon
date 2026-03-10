import React from 'react';

const LoginScreen = ({ onLogin }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 animate-fade-in text-center safe-area-p">
            <div className="mb-8 p-6 rounded-full border border-mystic-gold/20 bg-mystic-800/80 animate-pulse">
                <span className="text-6xl">🦌</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-4 tracking-tighter">
                Hunter's Sigil
            </h1>
            <p className="text-gray-500 font-mono text-sm mb-12">
                운명 개척을 위한 디지털 리추얼<br />
                <span className="text-xs text-mystic-gold opacity-70">Probability Optimization Protocol</span>
            </p>
            <button
                onClick={onLogin}
                className="flex items-center justify-center px-8 py-4 bg-[#FEE500] text-[#3c1e1e] rounded-lg font-bold w-full max-w-xs hover:bg-[#ebd400] transition transform hover:scale-105 shadow-lg active:scale-95 touch-manipulation"
            >
                <span className="mr-2 text-xl">💬</span> 카카오로 시작하기
            </button>
        </div>
    );
};

export default LoginScreen;
