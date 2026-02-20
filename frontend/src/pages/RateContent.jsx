import { useState, useRef } from "react";
import api from "../api/axiosClient";
import toast from "react-hot-toast";
import {
    BarChart2, Upload, Link as LinkIcon, Star,
    Lightbulb, AlertCircle, CheckCircle, Loader2, RefreshCw, Image as ImageIcon,
} from "lucide-react";

const PLATFORMS = ["instagram", "facebook", "youtube"];

function ScoreRing({ score }) {
    const pct = (score / 10) * 100;
    const color = score >= 8 ? "#22c55e" : score >= 6 ? "#6366f1" : "#f59e0b";
    const r = 52, circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;

    return (
        <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" width="144" height="144">
                <circle cx="72" cy="72" r={r} fill="none" stroke="#1e1e3a" strokeWidth="10" />
                <circle
                    cx="72" cy="72" r={r} fill="none"
                    stroke={color} strokeWidth="10"
                    strokeDasharray={`${dash} ${circ}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1s ease" }}
                />
            </svg>
            <div className="text-center">
                <p className="text-4xl font-black text-white">{score}</p>
                <p className="text-xs text-gray-400">/10</p>
            </div>
        </div>
    );
}

export default function RateContent() {
    const [platform, setPlatform] = useState("instagram");
    const [caption, setCaption] = useState("");
    const [url, setUrl] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [rating, setRating] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();

    const handleImage = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRate = async () => {
        if (!caption && !url && !image) {
            toast.error("Please add a caption, URL, or image to rate.");
            return;
        }
        setLoading(true);
        setRating(null);
        try {
            const { data } = await api.post("/content/rate-post", {
                caption, url,
                has_image: !!image,
                platform,
            });
            setRating(data);
            toast.success("Post rated successfully!");
        } catch {
            toast.error("Rating failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setCaption(""); setUrl(""); setImage(null); setImagePreview(null); setRating(null);
    };

    const scoreLabel = rating
        ? rating.score >= 8 ? { text: "Great Post! 🔥", color: "text-green-400" }
            : rating.score >= 6 ? { text: "Good, Room to Improve 💡", color: "text-brand-400" }
                : { text: "Needs Work ⚠️", color: "text-amber-400" }
        : null;

    return (
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto animate-fade-in">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <BarChart2 className="w-6 h-6 text-brand-400" /> How's My Content?
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Upload your post and get an AI-powered score with improvement tips.</p>
                    </div>
                    {rating && (
                        <button onClick={handleReset} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                            <RefreshCw className="w-4 h-4" /> Reset
                        </button>
                    )}
                </div>

                <div className="space-y-5">
                    {/* Platform selector */}
                    <div className="card">
                        <p className="text-xs text-gray-400 font-medium mb-3">Platform</p>
                        <div className="flex gap-2">
                            {PLATFORMS.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPlatform(p)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium capitalize border transition-all ${platform === p
                                        ? "bg-brand-600 border-brand-500 text-white"
                                        : "bg-surface border-surface-border text-gray-400 hover:text-white"}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image upload */}
                    <div className="card">
                        <p className="text-xs text-gray-400 font-medium mb-3 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Post Image (optional)</p>
                        {imagePreview ? (
                            <div className="relative">
                                <img src={imagePreview} alt="preview" className="w-full max-h-64 object-cover rounded-xl" />
                                <button
                                    onClick={() => { setImage(null); setImagePreview(null); }}
                                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80"
                                >✕</button>
                            </div>
                        ) : (
                            <div
                                onClick={() => inputRef.current.click()}
                                className="border-2 border-dashed border-surface-border rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-brand-600/50 hover:bg-brand-600/5 transition-all"
                            >
                                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && handleImage(e.target.files[0])} />
                                <Upload className="w-8 h-8 text-gray-600 mb-2" />
                                <p className="text-gray-500 text-sm">Click to upload post image</p>
                            </div>
                        )}
                    </div>

                    {/* URL input */}
                    <div className="card">
                        <label className="text-xs text-gray-400 font-medium mb-2 flex items-center gap-1"><LinkIcon className="w-3 h-3" /> Post URL (optional)</label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://instagram.com/p/..."
                            className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
                        />
                    </div>

                    {/* Caption input */}
                    <div className="card">
                        <label className="text-xs text-gray-400 font-medium mb-2 block">Caption / Post Text</label>
                        <textarea
                            rows={4}
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Paste your post caption here..."
                            className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                        />
                        <p className="text-gray-600 text-xs mt-1">{caption.length} characters</p>
                    </div>

                    {/* Rate button */}
                    <button
                        onClick={handleRate}
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
                        {loading ? "Analyzing your post…" : "⭐ Rate My Post"}
                    </button>

                    {/* Results */}
                    {rating && (
                        <div className="space-y-4 animate-fade-in">
                            {/* Score card */}
                            <div className="card flex flex-col sm:flex-row items-center gap-6">
                                <ScoreRing score={rating.score} />
                                <div className="flex-1 text-center sm:text-left">
                                    <p className={`text-xl font-bold mb-1 ${scoreLabel.color}`}>{scoreLabel.text}</p>
                                    <p className="text-gray-300 text-sm leading-relaxed">{rating.reason}</p>
                                </div>
                            </div>

                            {/* Score breakdown stars */}
                            <div className="card">
                                <p className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-brand-400" /> Score Breakdown
                                </p>
                                <div className="flex gap-1 mb-2">
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-2 flex-1 rounded-full transition-all ${i < rating.score
                                                ? rating.score >= 8 ? "bg-green-500"
                                                    : rating.score >= 6 ? "bg-brand-500"
                                                        : "bg-amber-500"
                                                : "bg-surface-border"}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-500 text-xs">{rating.score} out of 10 — {rating.score >= 8 ? "Top 20% of posts" : rating.score >= 6 ? "Above average" : "Below average — improvement needed"}</p>
                            </div>

                            {/* Suggestions */}
                            <div className="card">
                                <p className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-brand-400" /> Suggestions to Improve
                                </p>
                                <div className="space-y-3">
                                    {rating.suggestions.map((s, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-surface rounded-xl border border-surface-border">
                                            <div className="w-6 h-6 rounded-full bg-brand-600/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="text-xs text-brand-400 font-bold">{i + 1}</span>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed">{s}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
