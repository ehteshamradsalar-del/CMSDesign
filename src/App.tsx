import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ArtworkFormPage from "./pages/ArtworkFormPage";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes — nothing built here yet beyond the redirect,
              but any future Home/Portfolio/About/Contact page goes inside
              this PublicLayout wrapper so Header only shows here. */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Route>

                    {/* Auth routes — no Header, no Sidebar */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Dashboard routes — Sidebar lives inside DashboardPage itself */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/artworks/new"
                        element={
                            <ProtectedRoute>
                                <ArtworkFormPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/artworks/:id/edit"
                        element={
                            <ProtectedRoute>
                                <ArtworkFormPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;