import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    CreditCard, Building2, Lock, Zap, CheckCircle2, ArrowLeft, Shield,
} from "lucide-react";

const PLANS = [
    { id: "monthly", label: "Monthly", price: "₹999", period: "/month", save: null },
    { id: "yearly", label: "Yearly", price: "₹799", period: "/month", save: "Save 20%" },
];

const FEATURES = [
    "Unlimited AI content generation",
    "All social platforms connected",
    "Advanced analytics & reports",
    "Priority support",
    "Custom brand voice training",
    "Team collaboration (up to 5 seats)",
];

function InputField({ label, placeholder, type = "text", maxLength }) {
    const [val, setVal] = useState("");
    return (
        <div className="space-y-1.5">
            <label className="text-xs text-gray-400 font-medium">{label}</label>
            <input
                type={type}
                value={val}
                maxLength={maxLength}
                onChange={(e) => setVal(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-[#0e0e20] border border-surface-border rounded-xl px-3 py-2.5 text-sm
                           text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
            />
        </div>
    );
}

export default function Billing() {
    const navigate = useNavigate();
    const [plan, setPlan] = useState("yearly");
    const [tab, setTab] = useState("card"); // card | bank
    const [processing, setProcessing] = useState(false);

    const handleSubscribe = async () => {
        setProcessing(true);
        await new Promise((r) => setTimeout(r, 1500));
        setProcessing(false);
        toast.success("🎉 Pro Plan Activated! Welcome to CreatorFlow Pro.", { duration: 4000 });
        navigate("/dashboard");
    };

    return (
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto animate-fade-in">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface-hover transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Zap className="w-6 h-6 text-brand-400" /> Upgrade to Pro
                        </h1>
                        <p className="text-gray-400 text-sm mt-0.5">Unlock all features and supercharge your content.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Left — Plan + Payment */}
                    <div className="lg:col-span-3 space-y-5">

                        {/* Plan selector */}
                        <div className="card">
                            <h2 className="font-semibold text-white text-sm mb-4">Choose Your Plan</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {PLANS.map(({ id, label, price, period, save }) => (
                                    <button
                                        key={id}
                                        onClick={() => setPlan(id)}
                                        className={`relative p-4 rounded-xl border text-left transition-all ${plan === id
                                            ? "bg-brand-600/20 border-brand-500"
                                            : "bg-surface border-surface-border hover:border-brand-600/40"}`}
                                    >
                                        {save && (
                                            <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-semibold">{save}</span>
                                        )}
                                        <p className="text-xs text-gray-400 mb-1">{label}</p>
                                        <p className="text-2xl font-black text-white">{price}</p>
                                        <p className="text-xs text-gray-500">{period}</p>
                                        {plan === id && <CheckCircle2 className="w-4 h-4 text-brand-400 mt-2" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment method tabs */}
                        <div className="card">
                            <div className="flex gap-2 mb-5">
                                {[
                                    { id: "card", label: "💳 Card", icon: CreditCard },
                                    { id: "bank", label: "🏦 Bank Transfer", icon: Building2 },
                                ].map(({ id, label }) => (
                                    <button
                                        key={id}
                                        onClick={() => setTab(id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${tab === id
                                            ? "bg-brand-600/20 border-brand-500 text-brand-400"
                                            : "bg-surface border-surface-border text-gray-400 hover:text-white"}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {tab === "card" ? (
                                <div className="space-y-4">
                                    <InputField label="Cardholder Name" placeholder="Akshaya Kumar P" />
                                    <InputField label="Card Number" placeholder="1234  5678  9012  3456" maxLength={19} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField label="Expiry Date" placeholder="MM / YY" maxLength={7} />
                                        <InputField label="CVV" type="password" placeholder="•••" maxLength={4} />
                                    </div>
                                    <InputField label="Billing Address" placeholder="123 Main St, Chennai, India" />
                                    <InputField label="PIN / ZIP Code" placeholder="600001" maxLength={6} />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <InputField label="Account Holder Name" placeholder="Akshaya Kumar P" />
                                    <InputField label="Bank Name" placeholder="State Bank of India" />
                                    <InputField label="Account Number" placeholder="XXXX XXXX XXXX 1234" maxLength={20} />
                                    <InputField label="IFSC Code" placeholder="SBIN0001234" maxLength={11} />
                                    <InputField label="Account Type" placeholder="Savings / Current" />
                                    <InputField label="Branch" placeholder="Anna Nagar, Chennai" />
                                </div>
                            )}
                        </div>

                        {/* Subscribe button */}
                        <button
                            onClick={handleSubscribe}
                            disabled={processing}
                            className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Processing…
                                </span>
                            ) : (
                                <><Zap className="w-5 h-5" /> Subscribe &amp; Activate Pro</>
                            )}
                        </button>

                        <p className="text-center text-gray-600 text-xs flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" /> Secured by 256-bit SSL encryption. Cancel anytime.
                        </p>
                    </div>

                    {/* Right — Features */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="card bg-gradient-to-b from-brand-600/10 to-transparent border-brand-600/30">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">CreatorFlow Pro</p>
                                    <p className="text-gray-400 text-xs">Everything you need</p>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                {FEATURES.map((f, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-green-400" />
                                <p className="text-white text-sm font-semibold">Money-Back Guarantee</p>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed">
                                Not satisfied? Get a full refund within 7 days, no questions asked.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
