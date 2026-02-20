import { useState } from "react";
import {
    RefreshCw,
    Sparkles,
    Flame,
    Edit3,
    Check,
    X,
    Instagram,
    Youtube,
    Facebook,
} from "lucide-react";
import api from "../api/axiosClient";
import toast from "react-hot-toast";

const PlatformIcon = ({ platform }) => {
    const icons = {
        instagram: <Instagram className="w-4 h-4 text-pink-400" />,
        facebook: <Facebook className="w-4 h-4 text-blue-400" />,
        youtube: <Youtube className="w-4 h-4 text-red-400" />,
    };
    return icons[platform] || null;
};

export default function ContentCard({ item, onUpdate }) {
    const [data, setData] = useState(item);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState({});
    const [loading, setLoading] = useState(null); // 'improve' | 'engaging' | 'regenerate' | 'save'

    const platformBadge = {
        instagram: "badge-instagram",
        facebook: "badge-facebook",
        youtube: "badge-youtube",
    }[data.platform] || "badge";

    const startEdit = () => {
        setDraft({
            content_idea: data.content_idea,
            hook: data.hook,
            caption: data.caption,
            hashtags: data.hashtags,
            cta: data.cta,
            script: data.script,
            seo_title: data.seo_title,
            seo_description: data.seo_description,
            seo_tags: data.seo_tags,
        });
        setEditing(true);
    };

    const cancelEdit = () => { setEditing(false); setDraft({}); };

    const saveEdit = async () => {
        setLoading("save");
        try {
            const { data: updated } = await api.put(`/content/${data.id}`, draft);
            setData(updated.content);
            onUpdate?.(updated.content);
            setEditing(false);
            toast.success("Content saved!");
        } catch {
            toast.error("Save failed.");
        } finally {
            setLoading(null);
        }
    };

    const handleAction = async (action) => {
        setLoading(action);
        try {
            const { data: updated } = await api.post(`/content/${data.id}/${action}`);
            setData(updated.content);
            onUpdate?.(updated.content);
            toast.success(
                action === "improve" ? "Content improved!" :
                    action === "engaging" ? "Made more engaging!" :
                        "Content regenerated!"
            );
        } catch {
            toast.error(`${action} failed. Check your OpenAI key.`);
        } finally {
            setLoading(null);
        }
    };

    const Field = ({ label, value, field, multiline = false }) => (
        <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
            {editing ? (
                multiline ? (
                    <textarea
                        className="input text-sm resize-none"
                        rows={4}
                        value={draft[field] || ""}
                        onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                    />
                ) : (
                    <input
                        className="input text-sm"
                        value={draft[field] || ""}
                        onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                    />
                )
            ) : (
                <p className="text-sm text-gray-300 leading-relaxed">{value || <span className="text-gray-600 italic">—</span>}</p>
            )}
        </div>
    );

    return (
        <div className="card hover:border-brand-600/40 transition-all duration-200 animate-fade-in group">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-brand-600/20 border border-brand-600/30 rounded-xl
                          flex items-center justify-center text-sm font-bold text-brand-400">
                        {data.day}
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Day {data.day}</p>
                        <span className={`badge ${platformBadge} capitalize`}>
                            <PlatformIcon platform={data.platform} />
                            {data.platform}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editing ? (
                        <>
                            <button onClick={saveEdit} disabled={loading === "save"}
                                className="p-2 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors">
                                <Check className="w-4 h-4" />
                            </button>
                            <button onClick={cancelEdit}
                                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <button onClick={startEdit}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-hover transition-colors">
                            <Edit3 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Content idea */}
            <div className="mb-4">
                <Field label="Content Idea" value={data.content_idea} field="content_idea" />
            </div>

            {/* Fields by platform */}
            <div className="space-y-3 mb-5">
                <Field label="Hook" value={data.hook} field="hook" multiline />
                <Field label="Caption" value={data.caption} field="caption" multiline />
                {data.platform !== "youtube" && (
                    <Field label="Hashtags" value={data.hashtags} field="hashtags" />
                )}
                {data.platform === "youtube" && (
                    <>
                        <Field label="SEO Title" value={data.seo_title} field="seo_title" />
                        <Field label="SEO Description" value={data.seo_description} field="seo_description" multiline />
                        <Field label="SEO Tags" value={data.seo_tags} field="seo_tags" />
                        <Field label="Script" value={data.script} field="script" multiline />
                    </>
                )}
                <Field label="CTA" value={data.cta} field="cta" />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-surface-border">
                <button
                    onClick={() => handleAction("regenerate")}
                    disabled={!!loading}
                    className="btn-ghost text-xs flex items-center gap-1.5 border border-surface-border
                     rounded-lg px-3 py-1.5 hover:border-brand-600/50 disabled:opacity-40"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading === "regenerate" ? "animate-spin" : ""}`} />
                    Regenerate
                </button>
                <button
                    onClick={() => handleAction("improve")}
                    disabled={!!loading}
                    className="btn-ghost text-xs flex items-center gap-1.5 border border-surface-border
                     rounded-lg px-3 py-1.5 hover:border-purple-500/50 text-purple-400
                     disabled:opacity-40"
                >
                    <Sparkles className={`w-3.5 h-3.5 ${loading === "improve" ? "animate-spin" : ""}`} />
                    Improve Content
                </button>
                <button
                    onClick={() => handleAction("engaging")}
                    disabled={!!loading}
                    className="btn-ghost text-xs flex items-center gap-1.5 border border-surface-border
                     rounded-lg px-3 py-1.5 hover:border-orange-500/50 text-orange-400
                     disabled:opacity-40"
                >
                    <Flame className={`w-3.5 h-3.5 ${loading === "engaging" ? "animate-spin" : ""}`} />
                    Make Engaging
                </button>
            </div>
        </div>
    );
}
