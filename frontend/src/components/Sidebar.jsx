import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard,
    CalendarDays,
    Plug,
    Settings,
    LogOut,
    Zap,
    ChevronLeft,
    ChevronRight,
    User,
    Scissors,
    BarChart2,
} from "lucide-react";

const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/calendar", label: "Content Plan", icon: CalendarDays },
    { to: "/edit-video", label: "Edit My Video", icon: Scissors },
    { to: "/rate-content", label: "How's My Content?", icon: BarChart2 },
    { to: "/accounts", label: "Connections", icon: Plug },
    { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside
            className={`flex flex-col h-screen bg-surface-card border-r border-surface-border
                  transition-all duration-300 ease-in-out shrink-0
                  ${collapsed ? "w-16" : "w-60"}`}
        >
            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-surface-border">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-900/40">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-white text-lg tracking-tight">
                            Creator<span className="gradient-text">Flow</span>
                        </span>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-hover
                     transition-colors ml-auto"
                    aria-label="Toggle sidebar"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
               transition-all duration-150 group
               ${isActive
                                ? "bg-brand-600/20 text-brand-400 border border-brand-600/30"
                                : "text-gray-400 hover:text-white hover:bg-surface-hover"
                            }`
                        }
                        title={collapsed ? label : undefined}
                    >
                        <Icon className="w-5 h-5 shrink-0" />
                        {!collapsed && <span>{label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* User section */}
            <div className="border-t border-surface-border p-3 space-y-1">
                <NavLink
                    to="/profile-setup"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150
             ${isActive
                            ? "bg-brand-600/20 text-brand-400"
                            : "text-gray-400 hover:text-white hover:bg-surface-hover"
                        }`
                    }
                    title={collapsed ? "Profile" : undefined}
                >
                    {user?.picture ? (
                        <img src={user.picture} alt={user.name} className="w-5 h-5 rounded-full shrink-0" />
                    ) : (
                        <User className="w-5 h-5 shrink-0" />
                    )}
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
                            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                            <button
                                onClick={() => navigate("/billing")}
                                className="mt-1 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full
                                    bg-amber-500/15 border border-amber-500/30 text-amber-400
                                    hover:bg-amber-500/25 transition-colors"
                            >
                                ⭐ Free Plan
                            </button>
                        </div>
                    )}
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400
                     hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 w-full"
                    title={collapsed ? "Sign out" : undefined}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>Sign out</span>}
                </button>
            </div>
        </aside>
    );
}
