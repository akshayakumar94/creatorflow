import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import toast from "react-hot-toast";
import { Save, Building2, Users, Target, Repeat, Palette } from "lucide-react";

const BRAND_TONES = ["professional", "fun", "educational", "bold"];
const PRIMARY_GOALS = ["growth", "sales", "engagement"];
const FREQUENCIES = ["daily", "3x/week", "weekly"];

const Section = ({ icon: Icon, title, children }) => (
    <div className="card space-y-4">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-brand-600/20 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-brand-400" />
            </div>
            <h2 className="font-semibold text-white">{title}</h2>
        </div>
        {children}
    </div>
);

export default function ProfileSetup() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        business_name: "",
        industry: "",
        target_audience: "",
        brand_tone: "professional",
        primary_goal: "growth",
        posting_frequency: "daily",
    });

    useEffect(() => {
        api.get("/profile").then(({ data }) => {
            if (data.profile) setForm(data.profile);
        });
    }, []);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
    const pick = (k, v) => setForm({ ...form, [k]: v });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post("/profile", form);
            toast.success("Profile saved successfully!");
            navigate("/calendar");
        } catch (err) {
            toast.error(err?.response?.data?.error || "Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    const OptionButton = ({ value, current, onClick, label }) => (
        <button
            type="button"
            onClick={() => onClick(value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 capitalize
        ${current === value
                    ? "bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/30"
                    : "bg-surface border-surface-border text-gray-400 hover:text-white hover:border-surface-hover"
                }`}
        >
            {label || value}
        </button>
    );

    return (
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto animate-fade-in">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Firm Profile Setup</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Tell us about your brand so our AI can create perfectly tailored content.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Business info */}
                    <Section icon={Building2} title="Business Information">
                        <div>
                            <label className="label">Business Name *</label>
                            <input className="input" placeholder="e.g. Acme Marketing Co." value={form.business_name}
                                onChange={set("business_name")} required />
                        </div>
                        <div>
                            <label className="label">Industry *</label>
                            <input className="input" placeholder="e.g. E-commerce, SaaS, Fashion, Real Estate"
                                value={form.industry} onChange={set("industry")} required />
                        </div>
                    </Section>

                    {/* Audience */}
                    <Section icon={Users} title="Target Audience">
                        <div>
                            <label className="label">Describe your ideal customer *</label>
                            <textarea
                                className="input resize-none"
                                rows={3}
                                placeholder="e.g. Entrepreneurs aged 25-45 interested in productivity tools and business growth..."
                                value={form.target_audience}
                                onChange={set("target_audience")}
                                required
                            />
                        </div>
                    </Section>

                    {/* Brand tone */}
                    <Section icon={Palette} title="Brand Tone">
                        <p className="text-sm text-gray-400">How should your content sound?</p>
                        <div className="flex flex-wrap gap-2">
                            {BRAND_TONES.map((t) => (
                                <OptionButton key={t} value={t} current={form.brand_tone} onClick={(v) => pick("brand_tone", v)} />
                            ))}
                        </div>
                    </Section>

                    {/* Goal */}
                    <Section icon={Target} title="Primary Goal">
                        <p className="text-sm text-gray-400">What's the main objective of your content?</p>
                        <div className="flex flex-wrap gap-2">
                            {PRIMARY_GOALS.map((g) => (
                                <OptionButton key={g} value={g} current={form.primary_goal} onClick={(v) => pick("primary_goal", v)} />
                            ))}
                        </div>
                    </Section>

                    {/* Frequency */}
                    <Section icon={Repeat} title="Posting Frequency">
                        <p className="text-sm text-gray-400">How often do you plan to post?</p>
                        <div className="flex flex-wrap gap-2">
                            {FREQUENCIES.map((f) => (
                                <OptionButton key={f} value={f} current={form.posting_frequency} onClick={(v) => pick("posting_frequency", v)} />
                            ))}
                        </div>
                    </Section>

                    <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Profile & Continue"}
                    </button>
                </form>
            </div>
        </div>
    );
}
