import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosClient";
import toast from "react-hot-toast";
import {
    CalendarDays,
    Plug,
    Sparkles,
    TrendingUp,
    Instagram,
    Youtube,
    Facebook,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="card flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-white">{value ?? "—"}</p>
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    </div>
);

const platformColors = {
    instagram: "bg-pink-500/20 text-pink-300",
    facebook: "bg-blue-500/20 text-blue-300",
    youtube: "bg-red-500/20 text-red-300",
};

const PlatformIcon = ({ p }) =>
    ({ instagram: <Instagram className="w-4 h-4" />, facebook: <Facebook className="w-4 h-4" />, youtube: <Youtube className="w-4 h-4" /> })[p] ?? null;

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [calendar, setCalendar] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Read connections from localStorage (set by ConnectedAccounts page)
    const connectedCount = Object.keys(
        JSON.parse(localStorage.getItem("cf_connections") || "{}")
    ).length;

    useEffect(() => {
        Promise.all([
            api.get("/content/calendar"),
            api.get("/profile"),
        ]).then(([cal, prof]) => {
            setCalendar(cal.data.calendar || []);
            setProfile(prof.data.profile);
        }).finally(() => setLoading(false));
    }, []);

    const published = calendar.filter((c) => c.is_published).length;
    const upcoming = calendar.filter((c) => !c.is_published).slice(0, 3);

    const platformDist = calendar.reduce((acc, c) => {
        acc[c.platform] = (acc[c.platform] || 0) + 1;
        return acc;
    }, {});

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Welcome back, {user?.name?.split(" ")[0]} 👋
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {profile ? profile.business_name : "Complete your profile to get started"}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/billing")}
                        className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold
                            bg-gradient-to-r from-brand-600 to-purple-600 text-white
                            hover:opacity-90 transition-opacity shadow-lg shadow-brand-900/30 whitespace-nowrap"
                    >
                        ⚡ Activate Pro Plan
                    </button>
                    <Link to="/calendar" className="btn-primary flex items-center gap-2 text-sm">
                        <Sparkles className="w-4 h-4" />
                        Generate Content
                    </Link>
                </div>
            </div>

            {/* Profile incomplete banner */}
            {!profile && (
                <div className="p-4 bg-brand-600/10 border border-brand-600/30 rounded-2xl flex items-center
                        justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🎯</span>
                        <div>
                            <p className="text-white font-semibold text-sm">Complete your firm profile</p>
                            <p className="text-gray-400 text-xs mt-0.5">Set up your brand details to unlock AI content generation</p>
                        </div>
                    </div>
                    <Link to="/profile-setup" className="btn-primary text-sm whitespace-nowrap flex items-center gap-2">
                        Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="Total Posts" value={calendar.length} icon={CalendarDays} color="bg-brand-600" />
                <StatCard label="Published" value={published} icon={CheckCircle2} color="bg-green-600" />
                <StatCard label="Connected Accounts" value={connectedCount} icon={Plug} color="bg-purple-600" />
                <StatCard label="Remaining" value={calendar.length - published} icon={TrendingUp} color="bg-orange-600" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Platform distribution */}
                <div className="card col-span-1">
                    <h2 className="text-base font-semibold text-white mb-4">Platform Distribution</h2>
                    {Object.keys(platformDist).length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-6">No content generated yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {Object.entries(platformDist).map(([plat, count]) => (
                                <div key={plat} className="flex items-center gap-3">
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium ${platformColors[plat] || ""}`}>
                                        <PlatformIcon p={plat} />
                                        <span className="capitalize">{plat}</span>
                                    </div>
                                    <div className="flex-1 bg-surface-border rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${plat === "instagram" ? "bg-pink-500" : plat === "facebook" ? "bg-blue-500" : "bg-red-500"}`}
                                            style={{ width: `${(count / calendar.length) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-400 w-6 text-right">{count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming posts */}
                <div className="card col-span-1 xl:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-white">Upcoming Posts</h2>
                        <Link to="/calendar" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                            View all →
                        </Link>
                    </div>
                    {upcoming.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No upcoming posts. Generate your 30-day plan!</p>
                            <Link to="/calendar" className="btn-primary text-sm mt-4 inline-flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Generate Plan
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcoming.map((post) => (
                                <div key={post.id} className="flex items-start gap-3 p-3 bg-surface rounded-xl
                                              border border-surface-border hover:border-brand-600/30
                                              transition-colors">
                                    <div className="w-8 h-8 bg-brand-600/20 rounded-lg flex items-center justify-center
                                  text-xs font-bold text-brand-400 shrink-0">
                                        {post.day}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mb-1 ${platformColors[post.platform] || ""}`}>
                                            <PlatformIcon p={post.platform} />
                                            <span className="capitalize">{post.platform}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 truncate">{post.content_idea}</p>
                                        <p className="text-xs text-gray-500 mt-0.5 truncate">{post.hook}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
