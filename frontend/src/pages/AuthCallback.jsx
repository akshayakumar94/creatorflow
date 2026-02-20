import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            login(token);
            navigate("/dashboard", { replace: true });
        } else {
            navigate("/login?error=auth_failed", { replace: true });
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Completing sign in...</p>
            </div>
        </div>
    );
}
