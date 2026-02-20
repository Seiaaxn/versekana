// src/pages/ProfilePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, Mail, Calendar, Edit2, Check, X, Heart, BookOpen, Bell } from 'lucide-react';

const AUTH_KEY = 'animeplay_auth';
const USERS_KEY = 'animeplay_users';

const getUser = () => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch { return null; }
};

const updateProfileData = (updates) => {
    try {
        const user = getUser();
        if (!user) return;
        const updated = { ...user, ...updates };
        localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
        // Also update in users list
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const idx = users.findIndex(u => u.id === user.id);
        if (idx >= 0) { users[idx] = { ...users[idx], ...updates }; localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
        return updated;
    } catch { return null; }
};

const logoutUser = () => {
    try { localStorage.removeItem(AUTH_KEY); } catch {}
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(getUser);
    const [editing, setEditing] = useState(false);
    const [editUsername, setEditUsername] = useState(user?.username || '');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleSave = () => {
        if (!editUsername.trim()) return;
        const updated = updateProfileData({ username: editUsername.trim() });
        if (updated) setUser(updated);
        setEditing(false);
    };

    const handleCancel = () => {
        setEditUsername(user?.username || '');
        setEditing(false);
    };

    const handleLogout = () => {
        logoutUser();
        setUser(null);
        setShowLogoutConfirm(false);
    };

    const formatDate = (iso) => {
        try { return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); }
        catch { return '-'; }
    };

    const getInitial = (name) => name?.charAt(0).toUpperCase() || '?';

    if (!user) {
        return (
            <div className="min-h-screen bg-dark-bg pb-20">
                <header className="sticky top-0 z-40 glass border-b border-white/5">
                    <div className="px-4 flex items-center" style={{ height: '52px' }}>
                        <h1 className="text-sm font-semibold text-white">Profile</h1>
                    </div>
                </header>

                <div className="flex flex-col items-center justify-center px-6 pt-20 pb-10">
                    <div className="w-20 h-20 rounded-full bg-dark-card border border-white/8 flex items-center justify-center mb-4">
                        <User size={32} className="text-gray-700" />
                    </div>
                    <h2 className="text-base font-semibold text-white mb-1">Not logged in</h2>
                    <p className="text-xs text-gray-500 text-center mb-8 max-w-xs">
                        Login or register to save your watchlist, comment on episodes, and more.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 bg-primary-400 text-black font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-primary-300 transition-colors w-full max-w-xs justify-center"
                    >
                        <LogIn size={16} />
                        Login / Register
                    </button>
                    <div className="mt-10 w-full max-w-xs space-y-3">
                        {[
                            { icon: Heart, label: 'Save your favorite anime to My List' },
                            { icon: BookOpen, label: 'Comment on episodes' },
                            { icon: Bell, label: 'Get notified about new releases' },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 h-8 rounded-lg bg-dark-card flex items-center justify-center flex-shrink-0">
                                    <Icon size={15} className="text-gray-600" />
                                </div>
                                <span className="text-xs">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg pb-20">
            <header className="sticky top-0 z-40 glass border-b border-white/5">
                <div className="px-4 flex items-center justify-between" style={{ height: '52px' }}>
                    <h1 className="text-sm font-semibold text-white">Profile</h1>
                    <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors">
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </header>

            <div className="px-4 py-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary-400/20 border border-primary-400/30 flex items-center justify-center text-primary-400 text-2xl font-bold flex-shrink-0">
                        {getInitial(user.username)}
                    </div>
                    <div className="flex-1 min-w-0">
                        {editing ? (
                            <div className="flex items-center gap-2">
                                <input
                                    value={editUsername}
                                    onChange={e => setEditUsername(e.target.value)}
                                    className="flex-1 bg-dark-card border border-primary-400/30 rounded-lg px-3 py-1.5 text-sm text-white outline-none"
                                    autoFocus maxLength={20}
                                />
                                <button onClick={handleSave} className="p-1.5 bg-primary-400/20 text-primary-400 rounded-lg hover:bg-primary-400/30 transition-colors"><Check size={14} /></button>
                                <button onClick={handleCancel} className="p-1.5 bg-white/5 text-gray-500 rounded-lg hover:bg-white/10 transition-colors"><X size={14} /></button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-semibold text-white truncate">{user.username}</h2>
                                <button onClick={() => { setEditUsername(user.username); setEditing(true); }} className="p-1 text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0">
                                    <Edit2 size={13} />
                                </button>
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>
                    </div>
                </div>

                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-3 bg-dark-card rounded-xl px-4 py-3 border border-white/5">
                        <Mail size={15} className="text-gray-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-600 mb-0.5">Email</p>
                            <p className="text-xs text-white truncate">{user.email}</p>
                        </div>
                    </div>
                    {user.joinedAt && (
                        <div className="flex items-center gap-3 bg-dark-card rounded-xl px-4 py-3 border border-white/5">
                            <Calendar size={15} className="text-gray-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-gray-600 mb-0.5">Joined</p>
                                <p className="text-xs text-white">{formatDate(user.joinedAt)}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t border-white/5 mb-6" />

                <div className="space-y-2">
                    <button onClick={() => navigate('/mylist')} className="w-full flex items-center gap-3 bg-dark-card rounded-xl px-4 py-3 border border-white/5 hover:border-white/10 transition-colors">
                        <Heart size={15} className="text-gray-500" />
                        <span className="text-sm text-gray-300">My List</span>
                    </button>
                </div>

                <div className="mt-8">
                    <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center justify-center gap-2 border border-red-500/20 text-red-400 text-sm font-medium py-2.5 rounded-xl hover:bg-red-500/8 transition-colors">
                        <LogOut size={15} /> Logout
                    </button>
                </div>
            </div>

            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm pb-6 px-4">
                    <div className="w-full max-w-sm bg-dark-surface border border-white/8 rounded-2xl p-5 animate-slide-up">
                        <h3 className="text-sm font-semibold text-white mb-1">Logout?</h3>
                        <p className="text-xs text-gray-500 mb-4">You'll need to log in again to access personalized features.</p>
                        <div className="flex gap-2">
                            <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2.5 text-sm font-medium text-gray-400 bg-dark-card rounded-xl hover:bg-white/5 transition-colors">Cancel</button>
                            <button onClick={handleLogout} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500/80 rounded-xl hover:bg-red-500 transition-colors">Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
