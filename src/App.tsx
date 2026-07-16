import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { LanguageProvider } from "./lib/i18n";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";

import HomePage from "./pages/HomePage";
import ArchivePage from "./pages/ArchivePage";
import ArtworkDetailPage from "./pages/ArtworkDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ArtworkFormPage from "./pages/ArtworkFormPage";

function App() {
    return (
        <LanguageProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>

                    {/* Public pages */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/archive" element={<ArchivePage />} />
                        <Route path="/artworks/:id" element={<ArtworkDetailPage />} />
                    </Route>

                    {/* Authentication */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected dashboard */}
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

                    {/* fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />

                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </LanguageProvider>
    );
}

export default App;