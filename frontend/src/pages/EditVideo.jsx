import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Upload, Video, Play, Pause, Scissors, Hash, FileText, Download, RefreshCw } from "lucide-react";

const CLIP_DURATION = 20; // seconds to play

const HASHTAG_SETS = {
    default: ["#ContentCreator", "#VideoMarketing", "#SocialMedia", "#DigitalMarketing", "#Trending", "#Viral", "#CreatorEconomy", "#VideoEditing", "#Reels", "#ShortVideo"],
    business: ["#Business", "#Entrepreneur", "#Marketing", "#BrandGrowth", "#SmallBusiness", "#StartupLife", "#ContentStrategy", "#GrowthHacking"],
    lifestyle: ["#Lifestyle", "#DailyVlog", "#BehindTheScenes", "#Authentic", "#LifeStyle", "#GRWM"],
    food: ["#FoodVideo", "#Foodie", "#CafeLife", "#FoodBlogger", "#FoodPhotography", "#RestaurantLife"],
};

const CAPTIONS = [
    "🎬 Behind the scenes of our latest creation! Every second counts — and this 20-sec cut says it all. Drop a 🔥 if you want more!",
    "✂️ We trimmed it down to the best 20 seconds, because your time is valuable. This is what we've been working on! 👇",
    "🚀 Short, sharp, and straight to the point. Our story in 20 seconds — watch till the end!",
    "💡 Sometimes 20 seconds is all you need to make an impact. Here's ours — what do you think?",
    "🎯 Quality over quantity. 20 seconds. Full story. Swipe up to learn more!",
];

function UploadZone({ onFile }) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("video/")) onFile(file);
    };

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            className={`relative border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${dragging
                ? "border-brand-500 bg-brand-600/10"
                : "border-surface-border hover:border-brand-600/60 hover:bg-brand-600/5"
                }`}
        >
            <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />
            <div className="w-20 h-20 bg-brand-600/20 rounded-2xl flex items-center justify-center mb-5">
                <Upload className="w-10 h-10 text-brand-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Upload Your Video</h3>
            <p className="text-gray-400 text-sm text-center">Drag & drop or click to browse · MP4, MOV, AVI, WebM</p>
            <p className="text-brand-400 text-xs mt-3 font-medium">✂️ Will be trimmed to first 20 seconds automatically</p>
        </div>
    );
}

export default function EditVideo() {
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [toastShown, setToastShown] = useState(false);
    const videoRef = useRef();

    const hashtags = HASHTAG_SETS.default.concat(HASHTAG_SETS.business).slice(0, 12);
    const caption = CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)];

    const handleFile = (file) => {
        setVideoFile(file);
        setVideoUrl(URL.createObjectURL(file));
        setPlaying(false);
        setCurrentTime(0);
        setToastShown(false);
    };

    const handleTimeUpdate = () => {
        const v = videoRef.current;
        if (!v) return;
        setCurrentTime(v.currentTime);
        // Stop at 20 seconds
        if (v.currentTime >= CLIP_DURATION) {
            v.pause();
            v.currentTime = CLIP_DURATION;
            setPlaying(false);
        }
    };

    const handlePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.currentTime >= CLIP_DURATION) v.currentTime = 0;
        v.play();
        setPlaying(true);
        if (!toastShown) {
            toast("🎬 VIDEO Edited", {
                duration: 3000,
                style: { background: "#1a1a2e", color: "#fff", border: "1px solid #6366f1", borderRadius: "12px", fontWeight: "bold" },
            });
            setToastShown(true);
        }
    };

    const handlePause = () => {
        videoRef.current?.pause();
        setPlaying(false);
    };

    const handleLoadedMetadata = () => {
        setDuration(Math.min(videoRef.current?.duration || 0, CLIP_DURATION));
    };

    const progressPct = CLIP_DURATION > 0 ? Math.min((currentTime / CLIP_DURATION) * 100, 100) : 0;

    const handleReset = () => {
        videoRef.current?.pause();
        setVideoFile(null);
        setVideoUrl(null);
        setPlaying(false);
        setCurrentTime(0);
        setToastShown(false);
    };

    return (
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto animate-fade-in">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Scissors className="w-6 h-6 text-brand-400" /> Edit My Video
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Upload a video — we'll trim it to 20 seconds and generate captions & hashtags.</p>
                    </div>
                    {videoFile && (
                        <button onClick={handleReset} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                            <RefreshCw className="w-4 h-4" /> New Video
                        </button>
                    )}
                </div>

                {!videoUrl ? (
                    <UploadZone onFile={handleFile} />
                ) : (
                    <div className="space-y-6">
                        {/* Video player card */}
                        <div className="card overflow-hidden">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 bg-brand-600/20 rounded-xl flex items-center justify-center">
                                    <Video className="w-4 h-4 text-brand-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-semibold truncate">{videoFile.name}</p>
                                    <p className="text-gray-500 text-xs">Trimmed · First 20 seconds</p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-lg bg-brand-600/20 text-brand-400 border border-brand-600/30 font-bold">
                                    ✂️ 20s Clip
                                </span>
                            </div>

                            {/* Video */}
                            <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                                <video
                                    ref={videoRef}
                                    src={videoUrl}
                                    className="w-full h-full object-contain"
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    onPlay={() => setPlaying(true)}
                                    onPause={() => setPlaying(false)}
                                    preload="metadata"
                                />
                                {/* Play/Pause overlay */}
                                <button
                                    onClick={playing ? handlePause : handlePlay}
                                    className="absolute inset-0 flex items-center justify-center group"
                                >
                                    <div className={`w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:bg-white/30 ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
                                        {playing
                                            ? <Pause className="w-7 h-7 text-white" />
                                            : <Play className="w-7 h-7 text-white ml-1" />
                                        }
                                    </div>
                                </button>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{currentTime.toFixed(1)}s</span>
                                    <span className="text-brand-400 font-medium">20s clip</span>
                                </div>
                                <div className="w-full bg-surface-border rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-brand-600 to-purple-500 rounded-full transition-all duration-100"
                                        style={{ width: `${progressPct}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-center gap-3 pt-1">
                                    <button
                                        onClick={playing ? handlePause : handlePlay}
                                        className="btn-primary flex items-center gap-2 text-sm px-6"
                                    >
                                        {playing ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Play 20s Clip</>}
                                    </button>
                                    <button
                                        onClick={() => toast.success("Video will be posted as per schedule 📅", { duration: 3000 })}
                                        className="flex items-center gap-2 text-sm px-6 py-2 rounded-xl font-semibold
                                            bg-green-600/20 border border-green-500/40 text-green-400
                                            hover:bg-green-600/30 transition-all"
                                    >
                                        <Upload className="w-4 h-4" /> Post Video
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Hashtags */}
                        <div className="card">
                            <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
                                <Hash className="w-4 h-4 text-brand-400" /> Generated Hashtags
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {hashtags.map((tag, i) => (
                                    <span
                                        key={i}
                                        onClick={() => { navigator.clipboard?.writeText(tag); toast.success(`Copied ${tag}`); }}
                                        className="text-xs px-3 py-1.5 rounded-full bg-brand-600/15 border border-brand-600/30 text-brand-300 cursor-pointer hover:bg-brand-600/25 transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-600 text-xs mt-3">Click any hashtag to copy it</p>
                        </div>

                        {/* Caption */}
                        <div className="card">
                            <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
                                <FileText className="w-4 h-4 text-brand-400" /> Generated Caption
                            </h2>
                            <div className="bg-surface rounded-xl p-4 border border-surface-border">
                                <p className="text-gray-200 text-sm leading-relaxed">{caption}</p>
                            </div>
                            <button
                                onClick={() => { navigator.clipboard?.writeText(caption); toast.success("Caption copied!"); }}
                                className="mt-3 flex items-center gap-2 text-xs text-brand-400 hover:text-brand-300 transition-colors"
                            >
                                <Download className="w-3 h-3" /> Copy caption
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
