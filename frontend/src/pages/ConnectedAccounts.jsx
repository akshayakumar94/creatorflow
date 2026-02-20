import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
    Instagram, Youtube, Facebook, Plug, CheckCircle2,
    Loader2, Trash2,
} from "lucide-react";

const PLATFORMS = [
    {
        id: "instagram",
        label: "Instagram",
        description: "Share photo & video posts, Reels, and Stories.",
        icon: Instagram,
        color: "from-pink-600 to-purple-600",
    },
    {
        id: "facebook",
        label: "Facebook",
        description: "Publish posts to your Facebook Page and groups.",
        icon: Facebook,
        color: "from-blue-600 to-blue-800",
    },
    {
        id: "youtube",
        label: "YouTube",
        description: "Upload videos and manage your YouTube channel.",
        icon: Youtube,
        color: "from-red-600 to-red-800",
    },
];

export default function ConnectedAccounts() {
    const [connected, setConnected] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("cf_connections") || "{}");
        } catch {
            return {};
        }
    });
    const [connecting, setConnecting] = useState(null);

    const saveConnected = (updated) => {
        setConnected(updated);
        localStorage.setItem("cf_connections", JSON.stringify(updated));
    };

    const handleConnect = async (id, label) => {
        setConnecting(id);
        // Simulate brief connecting animation
        await new Promise((r) => setTimeout(r, 800));
        const updated = { ...connected, [id]: { name: `@${label.toLowerCase()}_account`, ts: Date.now() } };
        saveConnected(updated);
        setConnecting(null);
        toast.success(`Content will be posted as per schedule`, { duration: 3000 });
    };

    const handleDisconnect = (id, label) => {
        const updated = { ...connected };
        delete updated[id];
        saveConnected(updated);
        toast(`${label} disconnected`, { icon: "🔌" });
    };

    return (
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Plug className="w-6 h-6 text-brand-400" /> Connected Accounts
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    Connect your social media accounts to enable direct publishing.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {PLATFORMS.map(({ id, label, description, icon: Icon, color }) => {
                    const isConnected = !!connected[id];
                    const info = connected[id];
                    return (
                        <div key={id} className="card flex flex-col gap-4 hover:border-brand-600/40 transition-all duration-200">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                                <Icon className="w-7 h-7 text-white" />
                            </div>

                            <div>
                                <h3 className="font-semibold text-white">{label}</h3>
                                <p className="text-gray-400 text-sm mt-1">{description}</p>
                            </div>

                            {isConnected ? (
                                <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-green-400">Connected ✅</p>
                                        <p className="text-xs text-gray-400 truncate">{info?.name}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="px-3 py-2 bg-surface rounded-xl border border-surface-border text-xs text-gray-500">
                                    Not connected
                                </div>
                            )}

                            <div className="mt-auto">
                                {isConnected ? (
                                    <button
                                        onClick={() => handleDisconnect(id, label)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm
                               text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" /> Disconnect
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleConnect(id, label)}
                                        disabled={connecting === id}
                                        className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                                    >
                                        {connecting === id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Icon className="w-4 h-4" />
                                        )}
                                        {connecting === id ? "Connecting…" : `Connect ${label}`}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
