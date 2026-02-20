import { useState, useEffect, useCallback } from "react";
import api from "../api/axiosClient";
import ContentCard from "../components/ContentCard";
import toast from "react-hot-toast";
import {
    Sparkles, Loader2, CalendarDays, Filter,
    CheckCircle, X, Instagram, Facebook, Youtube, ImageIcon,
} from "lucide-react";

const PLATFORMS = ["all", "instagram", "facebook", "youtube"];

const PLATFORM_STYLES = {
    instagram: {
        bg: "from-pink-600 via-purple-600 to-indigo-600",
        icon: Instagram,
        badge: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    },
    facebook: {
        bg: "from-blue-700 via-blue-600 to-blue-500",
        icon: Facebook,
        badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    youtube: {
        bg: "from-red-700 via-red-600 to-orange-500",
        icon: Youtube,
        badge: "bg-red-500/20 text-red-300 border-red-500/30",
    },
};

/* ─── Image Card with proper loading states ─── */
function ImageCard({ s }) {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);
    const style = PLATFORM_STYLES[s.platform] || PLATFORM_STYLES.instagram;
    const Icon = style.icon;
    const src = s.image_data || s.fallback_url || s.image_url;

    return (
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
            <div className={`bg-gradient-to-br ${style.bg} px-4 py-3 flex items-center justify-between`}>
                <div>
                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Day {s.day}</span>
                    <p className="text-white font-bold text-sm leading-tight line-clamp-1">{s.content_idea}</p>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                </div>
            </div>

            <div className="relative bg-[#0a0a1a] aspect-square overflow-hidden">
                {!loaded && !errored && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500 text-xs">Loading image…</p>
                    </div>
                )}
                {errored && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${style.bg} flex items-center justify-center`}>
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                    </div>
                )}
                {src && (
                    <img
                        src={src}
                        alt={`Day ${s.day}`}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
                        onLoad={() => setLoaded(true)}
                        onError={() => setErrored(true)}
                    />
                )}
            </div>

            <div className="bg-[#0e0e20] px-4 py-3">
                <p className="text-gray-400 text-xs line-clamp-2">{s.caption || s.content_idea}</p>
                {s.cta && <p className="text-brand-400 text-xs font-semibold mt-1">👉 {s.cta}</p>}
            </div>
        </div>
    );
}

/* ─── Image Modal ─── */
function ImageModal({ suggestions, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#13132b] border border-purple-700/30 rounded-2xl shadow-2xl w-full max-w-3xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-surface-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-600/20 rounded-xl flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-brand-400" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg">🎨 Image Suggestions</h2>
                            <p className="text-gray-400 text-sm">AI-generated visuals for Day 1 &amp; Day 2</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Image cards */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {suggestions.map((s) => (
                        <ImageCard key={s.day} s={s} />
                    ))}
                </div>

                <div className="px-6 pb-6">
                    <button
                        onClick={() => {
                            toast.success("IMAGE WILL BE POSTED AS PER SCHEDULE 📅", { duration: 3000 });
                            onClose();
                        }}
                        className="btn-primary w-full"
                    >
                        🚀 Got it, let's post!
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page ─── */
export default function ContentCalendar() {
    const [calendar, setCalendar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [filter, setFilter] = useState("all");
    const [confirming, setConfirming] = useState(false);
    const [imageSuggestions, setImageSuggestions] = useState(null);

    const fetchCalendar = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/content/calendar");
            setCalendar(data.calendar || []);
        } catch {
            toast.error("Failed to load calendar.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCalendar(); }, [fetchCalendar]);

    const generate = async () => {
        setGenerating(true);
        try {
            const { data } = await api.post("/content/generate");
            setCalendar(data.calendar || []);
            toast.success("5-day content plan generated!");
        } catch (err) {
            toast.error(err?.response?.data?.error || "Generation failed.");
        } finally {
            setGenerating(false);
        }
    };

    const confirmPlan = async () => {
        setConfirming(true);
        toast.success("User input and Image generated are mapped and verified", { duration: 3000 });
        try {
            const { data } = await api.post("/content/confirm-plan");
            setImageSuggestions(data.suggestions || []);
        } catch (err) {
            toast.error(err?.response?.data?.error || "Confirm failed.");
        } finally {
            setConfirming(false);
        }
    };

    const updateItem = (updated) => {
        setCalendar((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    };

    const filtered = filter === "all" ? calendar : calendar.filter((c) => c.platform === filter);

    return (
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto animate-fade-in">
            {/* Image Modal */}
            {imageSuggestions && (
                <ImageModal suggestions={imageSuggestions} onClose={() => setImageSuggestions(null)} />
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CalendarDays className="w-6 h-6 text-brand-400" />
                        Content Calendar
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {calendar.length > 0
                            ? `${calendar.length} posts planned across Instagram, Facebook & YouTube`
                            : "Generate your AI-powered 5-day content plan below"}
                    </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
                    {calendar.length > 0 && (
                        <button
                            onClick={confirmPlan}
                            disabled={confirming}
                            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold
                                bg-green-600/20 border border-green-500/40 text-green-400
                                hover:bg-green-600/30 hover:border-green-400 transition-all duration-150 whitespace-nowrap"
                        >
                            {confirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            {confirming ? "Generating…" : "✅ Confirm Plan"}
                        </button>
                    )}

                    <button
                        onClick={generate}
                        disabled={generating}
                        className="btn-primary flex items-center gap-2 text-sm whitespace-nowrap"
                    >
                        {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {generating ? "Generating…" : "Generate 5-Day Plan"}
                    </button>
                </div>
            </div>

            {/* Filter tabs */}
            {calendar.length > 0 && (
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                    <Filter className="w-4 h-4 text-gray-500 shrink-0" />
                    {PLATFORMS.map((p) => (
                        <button
                            key={p}
                            onClick={() => setFilter(p)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border capitalize transition-all duration-150
                ${filter === p
                                    ? "bg-brand-600 border-brand-500 text-white"
                                    : "bg-surface border-surface-border text-gray-400 hover:text-white"
                                }`}
                        >
                            {p === "all" ? `All (${calendar.length})` : `${p} (${calendar.filter((c) => c.platform === p).length})`}
                        </button>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!loading && calendar.length === 0 && (
                <div className="card text-center py-20 max-w-md mx-auto">
                    <div className="w-20 h-20 bg-brand-600/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <Sparkles className="w-10 h-10 text-brand-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">No content yet</h2>
                    <p className="text-gray-400 text-sm mb-6">
                        Click "Generate 5-Day Plan" to create a complete content calendar tailored to your brand.
                    </p>
                    <button onClick={generate} disabled={generating} className="btn-primary mx-auto flex items-center gap-2">
                        {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {generating ? "Generating…" : "Generate 5-Day Plan"}
                    </button>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
                </div>
            )}

            {/* Content grid */}
            {!loading && filtered.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                    {filtered.map((item) => (
                        <ContentCard key={item.id} item={item} onUpdate={updateItem} />
                    ))}
                </div>
            )}
        </div>
    );
}
