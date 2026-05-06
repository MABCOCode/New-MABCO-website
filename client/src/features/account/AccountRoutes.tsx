import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { loadSession, saveSession } from "./storage";
import { getAccountAccess } from "./access";
import { LoginPage } from "./pages/LoginPage";
import { SignupFlow } from "./pages/SignupFlow";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { UserDashboard } from "./pages/UserDashboard";
import { OrdersPage } from "./pages/OrdersPage";
import { OrderDetailsPage } from "./pages/OrderDetailsPage";
import { MyDevicesPage } from "./pages/MyDevicesPage";
import { InvoicesPage } from "./pages/InvoicesPage";
import { AccountSettingsPage } from "./pages/AccountSettingsPage";

const ProductContentDashboard = lazy(() =>
  import("./pages/admin/ProductContentDashboard").then((m) => ({ default: m.ProductContentDashboard })),
);
const AdminOrderManagement = lazy(() =>
  import("./pages/admin/AdminOrderManagement").then((m) => ({ default: m.AdminOrderManagement })),
);
const BannerSliderManagement = lazy(() =>
  import("./pages/admin/BannerSliderManagement").then((m) => ({ default: m.BannerSliderManagement })),
);
const ShowroomsManagement = lazy(() =>
  import("./pages/admin/ShowroomsManagement").then((m) => ({ default: m.ShowroomsManagement })),
);
const SuperAdminDashboard = lazy(() =>
  import("./pages/superadmin/SuperAdminDashboard").then((m) => ({ default: m.SuperAdminDashboard })),
);
const AdminManagement = lazy(() =>
  import("./pages/superadmin/AdminManagement").then((m) => ({ default: m.AdminManagement })),
);
const ProductTracking = lazy(() =>
  import("./pages/superadmin/ProductTracking").then((m) => ({ default: m.ProductTracking })),
);
const AnalyticsReports = lazy(() =>
  import("./pages/superadmin/AnalyticsReports").then((m) => ({ default: m.AnalyticsReports })),
);
const NotificationManager = lazy(() =>
  import("./pages/superadmin/NotificationManager").then((m) => ({ default: m.NotificationManager })),
);

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

  if (!orderId) {
    return <Navigate to="/account/orders" replace />;
  }

  return (
    <OrderDetailsPage
      language={language}
      orderId={orderId}
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
    () => location.pathname.startsWith("/account/login") || location.pathname.startsWith("/account/signup") || location.pathname.startsWith("/account/forgot"),
    [location.pathname],
  );
  const isAdminRoute = useMemo(() => location.pathname.startsWith("/account/admin"), [location.pathname]);
  const access = useMemo(() => getAccountAccess(user), [user]);
  const {
    adminMeta,
    isAdminRole,
    isSuperAdmin,
    canManageOrders,
    canManageBanners,
    canManageShowrooms,
    canManageStore,
    hasAnyAdminAccess,
    permissionsResolved,
  } = access;
  const permissionsPending = Boolean(user && isAdminRole && !permissionsResolved);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthed && !isAuthRoute) {
      navigate("/account/login", { replace: true });
    }
  }, [isAuthed, isAuthRoute, navigate, hydrated]);

  useEffect(() => {
    if (!hydrated || !user) return;
    if (!isAdminRole || isSuperAdmin) return;
    if (user.adminMeta) return;
    let mounted = true;
    const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";
    fetch(`${apiBase}/admin/users/${encodeURIComponent(user.id || user._id)}/permissions`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!mounted || !json?.data) return;
        const nextUser = {
          ...user,
          adminMeta: json.data?.permissions || json.data?.adminMeta || json.data?.admin_meta || null,
        };
        updateUser(nextUser);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, [hydrated, user, updateUser, isAdminRole, isSuperAdmin]);

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

  const accountRouteFallback = <div className="min-h-[40vh] bg-white" />;

  return (
    <>
      {isAdminRoute && !permissionsPending && hasAnyAdminAccess && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              
              {canManageStore && (
                <button
                  onClick={() => navigate('/account/admin/content')}
                  className={`px-3 py-2 rounded-lg font-semibold ${location.pathname === '/account/admin/content' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {language === 'ar' ? 'إدارة المتجر' : 'Store Management'}
                </button>
              )}
              {canManageBanners && (
                <button
                  onClick={() => navigate('/account/admin/banners')}
                  className={`px-3 py-2 rounded-lg font-semibold ${location.pathname === '/account/admin/banners' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {language === 'ar' ? 'إدارة البانر' : 'Banner Slider'}
                </button>
              )}
              {canManageOrders && (
                <button
                  onClick={() => navigate('/account/admin/orders')}
                  className={`px-3 py-2 rounded-lg font-semibold ${location.pathname === '/account/admin/orders' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {t('admin.orders.title')}
                </button>
              )}
              {canManageShowrooms && (
                <button
                  onClick={() => navigate('/account/admin/showrooms')}
                  className={`px-3 py-2 rounded-lg font-semibold ${location.pathname === '/account/admin/showrooms' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {language === 'ar' ? 'إدارة الصالات' : 'Showrooms'}
                </button>
              )}
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
        <Suspense fallback={accountRouteFallback}>
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
            onForgotPassword={() => navigate("/account/forgot")}
          />
        }
      />
      <Route
        path="/forgot"
        element={
          <ForgotPasswordPage
            language={language}
            onClose={() => navigate("/")}
            onBackToLogin={() => navigate("/account/login")}
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
              onViewOrderDetails={(orderId) => navigate(`/account/orders/${encodeURIComponent(orderId)}`)}
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
              onSave={async (updatedUser) => updateUser(updatedUser)}
            />
          ) : (
            <Navigate to="/account/login" replace />
          )
        }
      />
      <Route
        path="/admin/content"
        element={
          permissionsPending ? null : canManageStore ? (
            <ProductContentDashboard onClose={() => navigate('/account/dashboard')} adminMeta={adminMeta} />
          ) : (
            <Navigate to={isAuthed ? "/account/dashboard" : "/account/login"} replace />
          )
        }
      />
      <Route
        path="/admin/banners"
        element={
          permissionsPending ? null : canManageBanners ? (
            <BannerSliderManagement language={language} onClose={() => navigate('/account/dashboard')} />
          ) : (
            <Navigate to={isAuthed ? "/account/dashboard" : "/account/login"} replace />
          )
        }
      />
      <Route
        path="/admin/orders"
        element={
          permissionsPending ? null : canManageOrders ? (
            <AdminOrderManagement />
          ) : (
            <Navigate to={isAuthed ? "/account/dashboard" : "/account/login"} replace />
          )
        }
      />
      <Route
        path="/admin/showrooms"
        element={
          permissionsPending ? null : canManageShowrooms ? (
            <ShowroomsManagement language={language} onClose={() => navigate('/account/dashboard')} />
          ) : (
            <Navigate to={isAuthed ? "/account/dashboard" : "/account/login"} replace />
          )
        }
      />
      <Route
        path="/superadmin"
        element={
          isSuperAdmin ? (
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
          ) : (
            <Navigate to={isAuthed ? "/account/dashboard" : "/account/login"} replace />
          )
        }
      />
      <Route
        path="/superadmin/admin-management"
        element={
          isSuperAdmin ? (
            <AdminManagement language={language} onBack={() => navigate("/account/superadmin")} />
          ) : (
            <Navigate to={isAuthed ? "/account/dashboard" : "/account/login"} replace />
          )
        }
      />
      <Route
        path="/superadmin/product-tracking"
        element={
          isSuperAdmin ? (
            <ProductTracking language={language} onBack={() => navigate("/account/superadmin")} />
          ) : (
            <Navigate to={isAuthed ? "/account/dashboard" : "/account/login"} replace />
          )
        }
      />
      <Route
        path="/superadmin/activity-log"
        element={
          isSuperAdmin ? (
            <ProductTracking language={language} onBack={() => navigate("/account/superadmin")} />
          ) : (
            <Navigate to={isAuthed ? "/account/dashboard" : "/account/login"} replace />
          )
        }
      />
      <Route
        path="/superadmin/analytics"
        element={
          isSuperAdmin ? (
            <AnalyticsReports language={language} onBack={() => navigate("/account/superadmin")} />
          ) : (
            <Navigate to={isAuthed ? "/account/dashboard" : "/account/login"} replace />
          )
        }
      />
      <Route
        path="/superadmin/notifications"
        element={
          isSuperAdmin ? (
            <NotificationManager language={language} onBack={() => navigate("/account/superadmin")} />
          ) : (
            <Navigate to={isAuthed ? "/account/dashboard" : "/account/login"} replace />
          )
        }
      />
      <Route path="*" element={<Navigate to={isAuthed ? "/account/dashboard" : "/account/login"} replace />} />
    </Routes>
        </Suspense>
        </div>
    </>
  );
};

export default AccountRoutes;
