// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

const AUTH_KEY = 'animeplay_auth';
const USERS_KEY = 'animeplay_users';

const getStoredUsers = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; } };
const getUser = () => { try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch { return null; } };

const LoginPage = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('login');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });

    // Redirect if already logged in
    useEffect(() => {
        if (getUser()) navigate('/', { replace: true });
    }, []);

    useEffect(() => {
        setError(''); setSuccess('');
    }, [tab]);

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.email || !form.password) { setError('Email and password are required.'); return; }

        setLoading(true);
        await new Promise(r => setTimeout(r, 500));

        const users = getStoredUsers();
        const found = users.find(u => u.email === form.email && u.password === form.password);
        if (!found) { setError('Incorrect email or password.'); setLoading(false); return; }

        const session = { id: found.id, username: found.username, email: found.email, joinedAt: found.joinedAt };
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        setLoading(false);
        navigate('/', { replace: true });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.username || !form.email || !form.password) { setError('All fields are required.'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }

        setLoading(true);
        await new Promise(r => setTimeout(r, 500));

        const users = getStoredUsers();
        if (users.find(u => u.email === form.email)) { setError('Email already registered.'); setLoading(false); return; }
        if (users.find(u => u.username === form.username)) { setError('Username already taken.'); setLoading(false); return; }

        const newUser = { id: Date.now().toString(), username: form.username, email: form.email, password: form.password, joinedAt: new Date().toISOString() };
        localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));

        const session = { id: newUser.id, username: newUser.username, email: newUser.email, joinedAt: newUser.joinedAt };
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        setLoading(false);
        navigate('/', { replace: true });
    };

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col">
            <header className="glass border-b border-white/5">
                <div className="flex items-center px-4" style={{ height: '52px' }}>
                    <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-white/8 rounded-full transition-colors mr-2">
                        <ArrowLeft size={18} className="text-gray-400" />
                    </button>
                    <span className="text-sm font-semibold text-white">{tab === 'login' ? 'Login' : 'Register'}</span>
                </div>
            </header>

            <div className="flex-1 px-6 py-8 max-w-sm mx-auto w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <span className="text-2xl font-bold">
                        <span className="text-white">Anime</span>
                        <span className="text-primary-400">Play</span>
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{tab === 'login' ? 'Welcome back!' : 'Create your account'}</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-dark-card rounded-xl p-1 mb-6 border border-white/5">
                    {['login', 'register'].map(t => (
                        <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === t ? 'bg-dark-surface text-white shadow-sm' : 'text-gray-500 hover:text-gray-400'}`}>
                            {t === 'login' ? 'Login' : 'Register'}
                        </button>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 mb-4">
                        <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                        <p className="text-xs text-red-400">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={tab === 'login' ? handleLogin : handleRegister} className="space-y-3">
                    {tab === 'register' && (
                        <div className="flex items-center gap-3 bg-dark-card border border-white/8 rounded-xl px-3 py-2.5 focus-within:border-white/20 transition-colors">
                            <User size={15} className="text-gray-600 flex-shrink-0" />
                            <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none" maxLength={20} />
                        </div>
                    )}

                    <div className="flex items-center gap-3 bg-dark-card border border-white/8 rounded-xl px-3 py-2.5 focus-within:border-white/20 transition-colors">
                        <Mail size={15} className="text-gray-600 flex-shrink-0" />
                        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none" />
                    </div>

                    <div className="flex items-center gap-3 bg-dark-card border border-white/8 rounded-xl px-3 py-2.5 focus-within:border-white/20 transition-colors">
                        <Lock size={15} className="text-gray-600 flex-shrink-0" />
                        <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Password" className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none" />
                        <button type="button" onClick={() => setShowPass(v => !v)} className="text-gray-600 hover:text-gray-400 transition-colors">
                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>

                    {tab === 'register' && (
                        <div className="flex items-center gap-3 bg-dark-card border border-white/8 rounded-xl px-3 py-2.5 focus-within:border-white/20 transition-colors">
                            <Lock size={15} className="text-gray-600 flex-shrink-0" />
                            <input name="confirmPassword" type={showConfirmPass ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none" />
                            <button type="button" onClick={() => setShowConfirmPass(v => !v)} className="text-gray-600 hover:text-gray-400 transition-colors">
                                {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-primary-400 text-black font-semibold text-sm py-3 rounded-xl hover:bg-primary-300 transition-colors disabled:opacity-50 mt-2">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                        {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
