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
import { ProductContentDashboard } from "./pages/admin/ProductContentDashboard";
import { AdminOrderManagement } from "./pages/admin/AdminOrderManagement";
import { SuperAdminDashboard } from "./pages/superadmin/SuperAdminDashboard";
import { AdminManagement } from "./pages/superadmin/AdminManagement";
import { ProductTracking } from "./pages/superadmin/ProductTracking";
import { AnalyticsReports } from "./pages/superadmin/AnalyticsReports";
import { NotificationManager } from "./pages/superadmin/NotificationManager";

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
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser, hydrated } = useSession();

  const isAuthed = !!user;
  const isAuthRoute = useMemo(
    () => location.pathname.startsWith("/account/login") || location.pathname.startsWith("/account/signup"),
    [location.pathname],
  );
  const isAdminRoute = useMemo(() => location.pathname.startsWith("/account/admin"), [location.pathname]);
  const isSuperAdminRoute = useMemo(
    () => location.pathname.startsWith("/account/superadmin"),
    [location.pathname],
  );

  useEffect(() => {
    if (!hydrated) return;
    // Allow admin routes to be accessible during development (treat all users as admins)
    if (!isAuthed && !isAuthRoute && !isAdminRoute && !isSuperAdminRoute) {
      navigate("/account/login", { replace: true });
    }
  }, [isAuthed, isAuthRoute, isAdminRoute, isSuperAdminRoute, navigate, hydrated]);

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
  if (!isAuthed && !isAuthRoute && !isAdminRoute && !isSuperAdminRoute) {
    return null;
  }

  return (
    <>
      {isAdminRoute && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/account/admin/content')}
                className={`px-3 py-2 rounded-lg font-semibold ${location.pathname === '/account/admin/content' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {t('admin.content.syncedProducts')}
              </button>
              <button
                onClick={() => navigate('/account/admin/orders')}
                className={`px-3 py-2 rounded-lg font-semibold ${location.pathname === '/account/admin/orders' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {t('admin.orders.title')}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')} 
                className="px-3 py-2 rounded-lg bg-gradient-to-br from-[#009FE3] to-[#007BC7] text-white font-semibold"
              >
                {t('home')}
              </button>
            </div>
          </div>
        </header>
      )}

      <div className={isAdminRoute ? 'pt-20' : ''}>
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
      <Route
        path="/admin/content"
        element={<ProductContentDashboard onClose={() => navigate('/account/dashboard')} />}
      />
      <Route
        path="/admin/orders"
        element={<AdminOrderManagement  />}
      />
      <Route
        path="/superadmin"
        element={
          <SuperAdminDashboard
            language={language}
            onNavigate={(view) => {
              if (view === "admin-management") navigate("/account/superadmin/admin-management");
              else if (view === "product-tracking") navigate("/account/superadmin/product-tracking");
              else if (view === "analytics") navigate("/account/superadmin/analytics");
              else if (view === "notifications") navigate("/account/superadmin/notifications");
              else if (view === "activity-log") navigate("/account/superadmin/activity-log");
            }}
            onClose={() => navigate("/")}
          />
        }
      />
      <Route
        path="/superadmin/admin-management"
        element={<AdminManagement language={language} onBack={() => navigate("/account/superadmin")} />}
      />
      <Route
        path="/superadmin/product-tracking"
        element={<ProductTracking language={language} onBack={() => navigate("/account/superadmin")} />}
      />
      <Route
        path="/superadmin/activity-log"
        element={<ProductTracking language={language} onBack={() => navigate("/account/superadmin")} />}
      />
      <Route
        path="/superadmin/analytics"
        element={<AnalyticsReports language={language} onBack={() => navigate("/account/superadmin")} />}
      />
      <Route
        path="/superadmin/notifications"
        element={<NotificationManager language={language} onBack={() => navigate("/account/superadmin")} />}
      />
      <Route path="*" element={<Navigate to={isAuthed ? "/account/dashboard" : "/account/login"} replace />} />
    </Routes>
        </div>
    </>
  );
};

export default AccountRoutes;
