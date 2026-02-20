// src/components/layout/MainLayout.jsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Heart, Search } from 'lucide-react';

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { id: 'home', label: 'Home', icon: Home, path: '/' },
        { id: 'explore', label: 'Explore', icon: Compass, path: '/explore' },
        { id: 'search', label: 'Search', icon: Search, path: '/search' },
        { id: 'mylist', label: 'My List', icon: Heart, path: '/mylist' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-dark-bg pb-20">
            <Outlet />

            <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 z-50 pb-safe">
                <div className="flex justify-around items-center h-14 max-w-lg mx-auto px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 ${
                                    active ? 'text-primary-400' : 'text-gray-600 hover:text-gray-400'
                                }`}
                            >
                                <Icon
                                    size={20}
                                    strokeWidth={active ? 2.5 : 1.5}
                                    className={active ? 'drop-shadow-[0_0_6px_rgba(255,175,47,0.6)]' : ''}
                                />
                                <span className={`text-[10px] font-medium tracking-wide ${active ? 'opacity-100' : 'opacity-50'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default MainLayout;
                          
