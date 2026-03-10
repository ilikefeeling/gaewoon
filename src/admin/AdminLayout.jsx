import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState(null); // Track auth user

    useEffect(() => {
        // 1. Ensure Auth First for Admin Panel
        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                console.log("AdminLayout: Authenticated as", currentUser.uid);
                setUser(currentUser);
            } else {
                console.log("AdminLayout: No user, signing in anonymously...");
                try {
                    await signInAnonymously(auth);
                } catch (error) {
                    console.error("AdminLayout: Auth Error", error);
                }
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const menuItems = [
        { path: '/admin', label: 'Overview', icon: '📊' },
        { path: '/admin/users', label: 'Users', icon: '👥' },
        { path: '/admin/payments', label: 'Payments', icon: '💳' },
        { path: '/admin/content', label: 'Content', icon: '📝' },
        // Settings removed - managed via env vars now
    ];

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-xl font-bold text-white tracking-wider">GAEWOON <span className="text-xs text-yellow-500">ADMIN</span></h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition-colors"
                    >
                        Exit to App
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-900 relative">
                <div className="p-8">
                    {/* Pass user to all admin pages if needed */}
                    <Outlet context={{ user }} />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
