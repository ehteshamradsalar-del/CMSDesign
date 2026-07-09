import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Header from "./components/navigation/Header";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ArtworkFormPage from "./pages/ArtworkFormPage";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Header />

                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

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