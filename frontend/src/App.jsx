import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import ProfileSetup from "./pages/ProfileSetup";
import ContentCalendar from "./pages/ContentCalendar";
import ConnectedAccounts from "./pages/ConnectedAccounts";
import Settings from "./pages/Settings";
import EditVideo from "./pages/EditVideo";
import RateContent from "./pages/RateContent";
import Billing from "./pages/Billing";

function AppLayout({ children }) {
    return (
        <div className="flex h-screen overflow-hidden bg-surface">
            <Sidebar />
            <main className="flex-1 overflow-hidden flex flex-col">
                {children}
            </main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "#1a1a2e",
                            color: "#f3f4f6",
                            border: "1px solid #2a2a45",
                            borderRadius: "12px",
                            fontSize: "14px",
                        },
                        success: { iconTheme: { primary: "#6366f1", secondary: "#fff" } },
                    }}
                />
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />

                    {/* Protected routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <AppLayout><Dashboard /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/profile-setup" element={
                        <ProtectedRoute>
                            <AppLayout><ProfileSetup /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/calendar" element={
                        <ProtectedRoute>
                            <AppLayout><ContentCalendar /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/accounts" element={
                        <ProtectedRoute>
                            <AppLayout><ConnectedAccounts /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/edit-video" element={
                        <ProtectedRoute>
                            <AppLayout><EditVideo /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/rate-content" element={
                        <ProtectedRoute>
                            <AppLayout><RateContent /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/billing" element={
                        <ProtectedRoute>
                            <AppLayout><Billing /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <AppLayout><Settings /></AppLayout>
                        </ProtectedRoute>
                    } />

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
