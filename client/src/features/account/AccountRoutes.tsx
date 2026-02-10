import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { loadSession, saveSession } from "./storage";
import { LoginPage } from "./pages/LoginPage";
import { SignupFlow } from "./pages/SignupFlow";
import { UserDashboard } from "./pages/UserDashboard";
import { OrdersPage } from "./pages/OrdersPage";
import { OrderDetailsPage } from "./pages/OrderDetailsPage";
import { MyDevicesPage } from "./pages/MyDevicesPage";
import { InvoicesPage } from "./pages/InvoicesPage";
import { AccountSettingsPage } from "./pages/AccountSettingsPage";

type Session = {
  user?: any;
};

const useSession = () => {
  const initialSession = loadSession() as Session | null;
  const [user, setUser] = useState<any | null>(initialSession?.user ?? null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const session = loadSession() as Session | null;
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
    setHydrated(true);
  }, []);

  const updateUser = (nextUser: any | null) => {
    setUser(nextUser);
    if (nextUser) {
      saveSession({ user: nextUser });
    } else {
      localStorage.removeItem("session");
    }
  };

  return { user, updateUser, hydrated };
};

const OrderDetailsRoute = ({ language }: { language: "ar" | "en" }) => {
  const { orderId } = useParams<{ orderId?: string }>();
  const navigate = useNavigate();
  const parsedId = orderId ? Number(orderId) : NaN;

  if (!orderId || Number.isNaN(parsedId)) {
    return <Navigate to="/account/orders" replace />;
  }

  return (
    <OrderDetailsPage
      language={language}
      orderId={parsedId}
      onBack={() => navigate("/account/orders")}
    />
  );
};

export const AccountRoutes = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser, hydrated } = useSession();

  const isAuthed = !!user;
  const isAuthRoute = useMemo(
    () => location.pathname.startsWith("/account/login") || location.pathname.startsWith("/account/signup"),
    [location.pathname],
  );

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthed && !isAuthRoute) {
      navigate("/account/login", { replace: true });
    }
  }, [isAuthed, isAuthRoute, navigate, hydrated]);

  const handleLoginSuccess = (nextUser: any) => {
    updateUser(nextUser);
    navigate("/account/dashboard");
  };

  const handleSignupSuccess = (nextUser: any) => {
    updateUser(nextUser);
    navigate("/account/dashboard");
  };

  const handleLogout = () => {
    updateUser(null);
    navigate("/account/login");
  };

  if (!hydrated) {
    return null;
  }
  if (!isAuthed && !isAuthRoute) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthed ? "/account/dashboard" : "/account/login"} replace />} />
      <Route
        path="/login"
        element={
          <LoginPage
            language={language}
            onClose={() => navigate("/")}
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignup={() => navigate("/account/signup")}
            onForgotPassword={() => navigate("/account/login")}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <SignupFlow
            language={language}
            onClose={() => navigate("/")}
            onSignupSuccess={handleSignupSuccess}
            onSwitchToLogin={() => navigate("/account/login")}
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthed ? (
            <UserDashboard
              language={language}
              user={user}
              onClose={() => navigate("/")}
              onNavigate={(section) => navigate(`/account/${section}`)}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/account/login" replace />
          )
        }
      />
      <Route
        path="/orders"
        element={
          isAuthed ? (
            <OrdersPage
              language={language}
              onBack={() => navigate("/account/dashboard")}
              onViewOrderDetails={(orderId) => navigate(`/account/orders/${orderId}`)}
            />
          ) : (
            <Navigate to="/account/login" replace />
          )
        }
      />
      <Route
        path="/orders/:orderId"
        element={isAuthed ? <OrderDetailsRoute language={language} /> : <Navigate to="/account/login" replace />}
      />
      <Route
        path="/devices"
        element={
          isAuthed ? (
            <MyDevicesPage
              language={language}
              onBack={() => navigate("/account/dashboard")}
            />
          ) : (
            <Navigate to="/account/login" replace />
          )
        }
      />
      <Route
        path="/invoices"
        element={
          isAuthed ? (
            <InvoicesPage
              language={language}
              onBack={() => navigate("/account/dashboard")}
            />
          ) : (
            <Navigate to="/account/login" replace />
          )
        }
      />
      <Route
        path="/settings"
        element={
          isAuthed ? (
            <AccountSettingsPage
              language={language}
              user={user}
              onBack={() => navigate("/account/dashboard")}
              onSave={(updatedUser) => updateUser(updatedUser)}
            />
          ) : (
            <Navigate to="/account/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to={isAuthed ? "/account/dashboard" : "/account/login"} replace />} />
    </Routes>
  );
};

export default AccountRoutes;
