import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import Layout from "./layout/Layout.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AddProblem from "./components/AddProblem.jsx";
import ProblemPage from "./pages/ProblemPage.jsx";
import LoginFailed from "./pages/LoginFailed.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CodeGodLanding from "./pages/CodeGodLanding.jsx";
import useThemeStore from "./store/useThemeStore.js";
import PrivacyPolicy from "./pages/LegalPrivacy.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import NotFound from "./pages/NotFound.jsx";
import RazorpayButton from "./RazorpayButton.jsx";
import Sheets from "./pages/Sheets.jsx";
import Sheet from "./pages/Sheet.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    // On mount, sync theme from Zustand to DOM
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-lg bg-zinc-950 dark:bg-white flex items-center justify-center">
            <Loader className="size-4 animate-spin text-white dark:text-zinc-950" />
          </div>
          <p className="text-sm text-zinc-500">Loading workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 antialiased">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 500,
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CodeGodLanding />} />

          <Route
            path="/problems"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />

          <Route path="/sheets" element={<Sheets />} />

          <Route path="/sheets/:id" element={<Sheet />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
        </Route>

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="/login"
          element={authUser ? <Navigate to={"/"} /> : <LoginPage />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />

        <Route path="/login-failed" element={<LoginFailed />} />

        <Route path="/problem/:id" element={<ProblemPage />} />

        <Route element={<AdminRoute />}>
          <Route
            path="/add-problem"
            element={authUser ? <AddProblem /> : <Navigate to="/" />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
