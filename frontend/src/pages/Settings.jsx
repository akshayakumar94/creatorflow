import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
    Settings as SettingsIcon, Mail, User, Calendar, Shield,
    Bell, Palette, Clock, Trash2, Save, Moon, Sun, Globe,
    Phone, MapPin, Briefcase, Lock, ChevronRight,
} from "lucide-react";

function SectionHeader({ icon: Icon, title, subtitle }) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-brand-600/20 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-brand-400" />
            </div>
            <div>
                <h2 className="font-semibold text-white text-sm">{title}</h2>
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
}

function Field({ label, value, type = "text", placeholder, onChange }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-medium">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2.5 text-sm
                           text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
            />
        </div>
    );
}

function Toggle({ label, sub, checked, onChange }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-surface-border last:border-0">
            <div>
                <p className="text-sm text-gray-200">{label}</p>
                {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${checked ? "bg-brand-600" : "bg-surface-border"}`}
            >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`} />
            </button>
        </div>
    );
}

export default function Settings() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Personal details state
    const [personal, setPersonal] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        location: "Chennai, India",
        bio: "Content creator & digital marketing enthusiast.",
        website: "",
        timezone: "Asia/Kolkata",
    });

    // Notification prefs
    const [notifs, setNotifs] = useState({
        emailDigest: true,
        contentReminders: true,
        publishAlerts: true,
        weeklyReport: false,
        newFeatures: true,
    });

    // Appearance
    const [theme, setTheme] = useState("dark");
    const [language, setLanguage] = useState("en");

    // Schedule
    const [schedule, setSchedule] = useState({
        instagram: "09:00",
        facebook: "12:00",
        youtube: "18:00",
    });

    const handleSave = () => {
        toast.success("Settings saved successfully ✅");
    };

    return (
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto animate-fade-in">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <SettingsIcon className="w-6 h-6 text-brand-400" /> Settings
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Manage your account, preferences & schedule.</p>
                    </div>
                    <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>

                {/* ── Profile ── */}
                <div className="card">
                    <SectionHeader icon={User} title="Personal Information" subtitle="Your public profile details" />

                    {/* Avatar + name */}
                    <div className="flex items-center gap-5 mb-6 p-4 bg-surface rounded-2xl border border-surface-border">
                        {user?.picture ? (
                            <img src={user.picture} alt={user.name}
                                className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-600/40 shrink-0" />
                        ) : (
                            <div className="w-20 h-20 rounded-2xl bg-brand-600/20 flex items-center justify-center shrink-0">
                                <User className="w-10 h-10 text-brand-400" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white truncate">{user?.name}</h3>
                            <p className="text-gray-400 text-sm">{user?.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Active
                                </span>
                                <button
                                    onClick={() => navigate("/billing")}
                                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full
                                        bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold
                                        hover:opacity-90 transition-opacity shadow-lg shadow-brand-900/30"
                                >
                                    ⚡ Activate Pro Plan
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Full Name" value={personal.name} onChange={(v) => setPersonal({ ...personal, name: v })} placeholder="Your full name" />
                        <Field label="Email Address" value={personal.email} type="email" onChange={(v) => setPersonal({ ...personal, email: v })} placeholder="you@example.com" />
                        <Field label="Phone Number" value={personal.phone} type="tel" onChange={(v) => setPersonal({ ...personal, phone: v })} placeholder="+91 98765 43210" />
                        <Field label="Location" value={personal.location} onChange={(v) => setPersonal({ ...personal, location: v })} placeholder="City, Country" />
                        <Field label="Website / Portfolio" value={personal.website} onChange={(v) => setPersonal({ ...personal, website: v })} placeholder="https://yoursite.com" />
                        <Field label="Timezone" value={personal.timezone} onChange={(v) => setPersonal({ ...personal, timezone: v })} placeholder="Asia/Kolkata" />
                    </div>

                    <div className="mt-4 space-y-1.5">
                        <label className="text-xs text-gray-400 font-medium">Bio</label>
                        <textarea
                            rows={3}
                            value={personal.bio}
                            onChange={(e) => setPersonal({ ...personal, bio: e.target.value })}
                            placeholder="A short bio about yourself..."
                            className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2.5 text-sm
                                       text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                        />
                    </div>
                </div>

                {/* ── Posting Schedule ── */}
                <div className="card">
                    <SectionHeader icon={Clock} title="Posting Schedule" subtitle="Set default posting times per platform" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { key: "instagram", label: "Instagram", color: "from-pink-600 to-purple-600" },
                            { key: "facebook", label: "Facebook", color: "from-blue-600 to-blue-800" },
                            { key: "youtube", label: "YouTube", color: "from-red-600 to-red-800" },
                        ].map(({ key, label, color }) => (
                            <div key={key} className="bg-surface border border-surface-border rounded-xl p-4">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                                    <Clock className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-xs text-gray-400 mb-1">{label}</p>
                                <input
                                    type="time"
                                    value={schedule[key]}
                                    onChange={(e) => setSchedule({ ...schedule, [key]: e.target.value })}
                                    className="w-full bg-[#0e0e20] border border-surface-border rounded-lg px-2 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-brand-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Notifications ── */}
                <div className="card">
                    <SectionHeader icon={Bell} title="Notifications" subtitle="Control what updates you receive" />
                    <Toggle label="Email Digest" sub="Daily summary of your content performance" checked={notifs.emailDigest} onChange={(v) => setNotifs({ ...notifs, emailDigest: v })} />
                    <Toggle label="Content Reminders" sub="Get reminded before scheduled posts go live" checked={notifs.contentReminders} onChange={(v) => setNotifs({ ...notifs, contentReminders: v })} />
                    <Toggle label="Publish Alerts" sub="Notify when content is successfully published" checked={notifs.publishAlerts} onChange={(v) => setNotifs({ ...notifs, publishAlerts: v })} />
                    <Toggle label="Weekly Report" sub="7-day performance summary every Monday" checked={notifs.weeklyReport} onChange={(v) => setNotifs({ ...notifs, weeklyReport: v })} />
                    <Toggle label="New Features" sub="Stay updated on product improvements" checked={notifs.newFeatures} onChange={(v) => setNotifs({ ...notifs, newFeatures: v })} />
                </div>

                {/* ── Appearance ── */}
                <div className="card">
                    <SectionHeader icon={Palette} title="Appearance" subtitle="Customize your interface" />
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                            { id: "dark", label: "Dark Mode", icon: Moon },
                            { id: "light", label: "Light Mode", icon: Sun },
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setTheme(id)}
                                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${theme === id
                                    ? "bg-brand-600/20 border-brand-500 text-brand-400"
                                    : "bg-surface border-surface-border text-gray-400 hover:border-gray-500"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-medium flex items-center gap-1"><Globe className="w-3 h-3" /> Language</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-brand-500"
                        >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="ta">Tamil</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                    </div>
                </div>

                {/* ── Security ── */}
                <div className="card">
                    <SectionHeader icon={Shield} title="Security & Authentication" subtitle="How you sign into Creator Flow" />
                    <div className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-surface-border mb-3">
                        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm text-white font-medium">Google OAuth</p>
                            <p className="text-xs text-gray-500">Signed in securely via Google · {user?.email}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">Verified</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surface-border">
                        <div className="flex items-center gap-3">
                            <Lock className="w-4 h-4 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-200">Two-Factor Authentication</p>
                                <p className="text-xs text-gray-500">Add an extra layer of security</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                            Enable <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* ── Danger Zone ── */}
                <div className="card border-red-500/20">
                    <SectionHeader icon={Trash2} title="Danger Zone" subtitle="Irreversible account actions" />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                        <div>
                            <p className="text-sm text-red-400 font-medium">Delete Account</p>
                            <p className="text-xs text-gray-500 mt-0.5">Permanently delete your account and all data. This cannot be undone.</p>
                        </div>
                        <button
                            onClick={() => toast.error("Please contact support to delete your account.")}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-all whitespace-nowrap shrink-0"
                        >
                            <Trash2 className="w-4 h-4" /> Delete Account
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
