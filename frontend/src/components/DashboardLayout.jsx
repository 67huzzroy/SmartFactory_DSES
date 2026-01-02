import React from 'react';
import { LayoutDashboard, Activity, Brain, Settings, Bell, User, Sun, Moon } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-colors ${active
            ? 'bg-primary/10 text-primary border-l-2 border-primary'
            : 'text-gray-400 hover:bg-surface hover:text-white'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium text-sm">{label}</span>
    </button>
);

export const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
    const [isDarkMode, setIsDarkMode] = React.useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        // Future: Implement actual theme switching logic here (e.g., updating document class)
    };

    return (
        <div className={`flex h-screen bg-background text-white overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
            {/* Sidebar */}
            <aside className="w-64 bg-black/40 border-r border-white/5 flex flex-col">
                <div className="p-6 flex items-center gap-2">
                    <Activity className="text-primary" />
                    <h1 className="text-xl font-bold tracking-tight">SmartFactory</h1>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Overview"
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                    />
                    <SidebarItem
                        icon={Activity}
                        label="Virtual Simulator"
                        active={activeTab === 'simulator'}
                        onClick={() => setActiveTab('simulator')}
                    />
                    <SidebarItem
                        icon={Brain}
                        label="Decision Support"
                        active={activeTab === 'dss'}
                        onClick={() => setActiveTab('dss')}
                    />
                    <SidebarItem
                        icon={Brain}
                        label="Expert System"
                        active={activeTab === 'es'}
                        onClick={() => setActiveTab('es')}
                    />
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        active={activeTab === 'settings'}
                        onClick={() => setActiveTab('settings')}
                    />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-surface/30 backdrop-blur-sm">
                    <h2 className="text-lg font-medium">Manufacturing Intelligence</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                            <User size={16} className="text-white" />
                        </div>
                    </div>
                </header>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};
