import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { getActiveWishTree } from '../../utils/luck_logic';

const UsersPage = () => {
    const [wishTree, setWishTree] = useState(getActiveWishTree());

    useEffect(() => {
        const handleUpdate = () => setWishTree(getActiveWishTree());
        window.addEventListener('wishTreeUpdated', handleUpdate);
        return () => window.removeEventListener('wishTreeUpdated', handleUpdate);
    }, []);

    const WISH_TREE = wishTree;
    // Real Data from Firestore
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const q = query(collection(firestore, "users"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const loadedUsers = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    loadedUsers.push({
                        id: doc.id,
                        name: data.nickname || "Anonymous",
                        email: data.kakaoId ? `kakao:${data.kakaoId}` : "Unknown",
                        joined: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : "-",
                        talismans: 0, // Placeholder
                        status: 'Active',
                        mainGoal: 'wealth' // Default for now
                    });
                });
                setUsers(loadedUsers);
            } catch (e) {
                console.error("Error fetching users:", e);
            }
        };
        fetchUsers();
    }, []);

    const handleBan = (id) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Banned' ? 'Active' : 'Banned' } : u));
    };

    return (
        <div>
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">User Management</h2>
                    <p className="text-gray-400 mt-2">Manage registered users and permissions.</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-white text-sm font-bold">
                    + Add User (Manual)
                </button>
            </header>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-700/50 text-gray-400 text-sm uppercase">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Main Goal</th>
                                <th className="px-6 py-4">Joined Date</th>
                                <th className="px-6 py-4 text-center">Talismans</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users.map(user => {
                                const goal = WISH_TREE[user.mainGoal] || WISH_TREE.wealth;
                                return (
                                    <tr key={user.id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs text-white font-bold mr-3">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center text-sm font-bold ${goal.color}`}>
                                                <span className="mr-2 text-lg">{goal.icon}</span>
                                                {goal.label.split('(')[0].trim()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">{user.joined}</td>
                                        <td className="px-6 py-4 text-center text-gray-300 text-sm">{user.talismans}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'Active' ? 'bg-green-900/50 text-green-400' :
                                                user.status === 'Inactive' ? 'bg-gray-700 text-gray-400' :
                                                    'bg-red-900/50 text-red-400'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleBan(user.id)}
                                                className="text-gray-400 hover:text-white text-sm underline"
                                            >
                                                {user.status === 'Banned' ? 'Unban' : 'Ban'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
