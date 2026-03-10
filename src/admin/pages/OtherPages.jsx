import React, { useMemo, useState, useEffect } from 'react';
import { getActiveWishTree, saveWishTree, resetWishTree } from '../../utils/luck_logic';

export const PaymentsPage = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">Payment History</h2>
            <div className="p-12 text-center border-2 border-dashed border-gray-700 rounded-xl text-gray-500">
                Mock Payment Data Integration Required.<br />
                (Stripe / Tosspayments module placeholder)
            </div>
        </div>
    );
};

export const ContentPage = () => {
    const [wishTree, setWishTree] = useState(getActiveWishTree());

    useEffect(() => {
        const handleUpdate = () => setWishTree(getActiveWishTree());
        window.addEventListener('wishTreeUpdated', handleUpdate);
        return () => window.removeEventListener('wishTreeUpdated', handleUpdate);
    }, []);

    const handleReset = () => {
        if (window.confirm("Warning: This will reset all Wish Categories to the original system defaults. All custom changes will be lost.")) {
            resetWishTree();
            setWishTree(getActiveWishTree());
        }
    };

    const categories = useMemo(() => wishTree ? Object.values(wishTree) : [], [wishTree]);

    // --- CRUD HANDLERS ---
    const handleAddCategory = () => {
        const id = prompt("Enter Category ID (english, unique):", "");
        if (!id) return;
        if (wishTree[id]) { alert("ID already exists!"); return; }

        const label = prompt("Enter Category Label (e.g. '여행 (Travel)'):", "");
        if (!label) return;

        const icon = prompt("Enter Icon Emoji:", "✈️");
        const color = prompt("Enter Tailwind Color Class (e.g. text-blue-400):", "text-gray-400");

        const newCat = {
            id, label, icon, color,
            visual: { accent: '#ffffff' },
            items: []
        };

        const newTree = { ...wishTree, [id]: newCat };
        saveWishTree(newTree);
        setWishTree(newTree); // Optimistic update
    };

    const handleDeleteCategory = (id) => {
        if (!window.confirm(`Are you sure you want to delete category '${id}'?`)) return;
        const newTree = { ...wishTree };
        delete newTree[id];
        saveWishTree(newTree);
        setWishTree(newTree);
    };

    const handleEditCategory = (id) => {
        const cat = wishTree[id];
        const newLabel = prompt("Edit Label:", cat.label);
        if (newLabel) {
            const newTree = { ...wishTree, [id]: { ...cat, label: newLabel } };
            saveWishTree(newTree);
            setWishTree(newTree);
        }
    };

    const handleAddSubItem = (catId) => {
        const cat = wishTree[catId];
        const id = prompt("Enter Sub-Item ID (english, unique in category):", "");
        if (!id) return;
        if (cat.items.find(i => i.id === id)) { alert("ID already exists!"); return; }

        const label = prompt("Enter Label:", "");
        const desc = prompt("Enter Description:", "");

        const newItem = { id, label, desc };
        const newItems = [...cat.items, newItem];

        const newTree = { ...wishTree, [catId]: { ...cat, items: newItems } };
        saveWishTree(newTree);
        setWishTree(newTree);
    };

    const handleDeleteSubItem = (catId, subId) => {
        if (!window.confirm(`Delete sub-item '${subId}'?`)) return;
        const cat = wishTree[catId];
        const newItems = cat.items.filter(i => i.id !== subId);
        const newTree = { ...wishTree, [catId]: { ...cat, items: newItems } };
        saveWishTree(newTree);
        setWishTree(newTree);
    };


    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">Content Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">Wish Categories (Editable)</h3>
                        <div className="flex gap-2">
                            <button onClick={handleReset} className="text-xs bg-red-900/50 hover:bg-red-900 text-red-200 px-3 py-1 rounded transition-colors border border-red-800">Reset Defaults</button>
                            <button onClick={handleAddCategory} className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition-colors">+ Add Category</button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {categories.map((cat) => (
                            <div key={cat.id} className="bg-gray-700/30 rounded overflow-hidden group">
                                <div className={`flex justify-between items-center p-3 border-b border-gray-700/50 ${cat.color ? cat.color.replace('text-', 'bg-').replace('400', '900/20') : ''}`}>
                                    <span className={`font-bold ${cat.color} flex items-center`}>
                                        <span className="mr-2 text-lg">{cat.icon}</span>
                                        {cat.label.split('(')[0].trim()}
                                        <button onClick={() => handleEditCategory(cat.id)} className="ml-2 text-gray-500 hover:text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">✏️</button>
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">Active</span>
                                        <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 hover:text-red-300 text-xs px-2 opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-800/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Sub Items</div>
                                        <button onClick={() => handleAddSubItem(cat.id)} className="text-[10px] bg-gray-600 hover:bg-gray-500 text-white px-2 py-0.5 rounded">+ Add Sub</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {cat.items.map((item) => (
                                            <span key={item.id} className="group/sub flex items-center text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded border border-gray-600">
                                                {item.label.split('(')[0].trim()}
                                                <button onClick={() => handleDeleteSubItem(cat.id, item.id)} className="ml-1 text-red-400 hover:text-red-300 text-[10px] opacity-0 group-hover/sub:opacity-100 transition-opacity">×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit">
                    <h3 className="text-xl font-bold text-white mb-4">Weather Context</h3>
                    <p className="text-sm text-gray-400 mb-4">Manage environmental luck variables.</p>
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Current API</span>
                            <span className="text-indigo-400">OpenWeatherMap</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Update Interval</span>
                            <span className="text-white">Every 1 Hour</span>
                        </div>
                    </div>
                    <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white text-sm font-bold transition-colors">
                        Update Algorithm Parameters
                    </button>
                </div>
            </div>
        </div>
    );
};
