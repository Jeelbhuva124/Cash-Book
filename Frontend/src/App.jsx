import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ─── Context Providers ────────────────────────────────────
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// ─── Shared Components ────────────────────────────────────
import { Toaster } from './components/Toaster';
import { RouteScrollToTop } from './components/RouteScrollToTop';

// ─── Landing Page ─────────────────────────────────────────
import { LandingPage } from './page/LandingPage';
import { About } from './page/About';
import { Services } from './page/Services';
import { Blog } from './page/Blog';
import { Contact } from './page/Contact';
import { FAQ } from './page/FAQ';
import { HelpCenter } from './page/HelpCenter';
import { Legal } from './page/Legal';
import { Roadmap } from './page/Roadmap';
import { Privacy } from './page/Privacy';
import { Terms } from './page/Terms';
import { Security } from './page/Security';

// ─── Dashboard Pages ──────────────────────────────────────
import Landing from './Dashboard/pages/Home';
import Analytics from './Dashboard/pages/Analytics';
import Transactions from './Dashboard/pages/Transactions';
import Reports from './Dashboard/pages/Reports';
import History from './Dashboard/pages/History';
import Savings from './Dashboard/pages/Savings';
import Reminders from './Dashboard/pages/Reminders';
import Categories from './Dashboard/pages/Categories';
import Subcategories from './Dashboard/pages/Subcategories';
import PaymentModes from './Dashboard/pages/PaymentModes';
import Chalans from './Dashboard/pages/Chalans';
import Invitations from './Dashboard/pages/Invitations';
import Cashbooks from './Dashboard/pages/Cashbooks';
import Profile from './Dashboard/pages/Profile';

import { SettingsPage } from './Dashboard/pages/SettingsPage';
import { Preferences } from './Dashboard/pages/Preferences';
import { ActiveSessions } from './Dashboard/pages/ActiveSessions';
import { DashboardLayout } from './Dashboard/components/DashboardLayout';

// ─── Admin Panel Pages & Auth ──────────────────────────────
import { AdminLayout } from './AdminPanel/components/AdminLayout';
import { AdminProtectedRoute } from './AdminPanel/components/AdminProtectedRoute';
import { AdminLogin } from './AdminPanel/pages/AdminLogin';
import { AdminRegister } from './AdminPanel/pages/AdminRegister';
import { AdminDashboard } from './AdminPanel/pages/AdminDashboard';
import { UserManagement } from './AdminPanel/pages/UserManagement';
import { CashbookManagement } from './AdminPanel/pages/CashbookManagement';
import { SystemAnalytics } from './AdminPanel/pages/SystemAnalytics';
import { AdminSettings } from './AdminPanel/pages/AdminSettings';

// ─── Auth Pages ───────────────────────────────────────────
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';

// ─── User Layout ──────────────────────────────────────────
import { UserLayout } from './components/UserLayout';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="cashbook-ui-theme">
      <ToastProvider>
        <Router>
          <RouteScrollToTop />
          <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Routes>
              {/* ── Auth Pages ── */}
              <Route path="/login" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* ── Admin Auth Routes ── */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />

              {/* ── Admin Panel Protected Routes ── */}
              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="cashbooks" element={<CashbookManagement />} />
                  <Route path="analytics" element={<SystemAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>

              {/* ── AI Dashboard ── */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Landing />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="accounts" element={<Landing />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="reports" element={<Reports />} />
                <Route path="history" element={<History />} />
                
                {/* Reference Dashboard Routes */}
                <Route path="chalans" element={<Chalans />} />
                <Route path="categories" element={<Categories />} />
                <Route path="subcategories" element={<Subcategories />} />
                <Route path="payment-modes" element={<PaymentModes />} />
                <Route path="invitations" element={<Invitations />} />
                <Route path="cashbooks" element={<Cashbooks />} />

                <Route path="budgets" element={<Landing />} />
                <Route path="savings" element={<Savings />} />
                <Route path="reminders" element={<Reminders />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="settings/profile" element={<Profile />} />
                <Route path="settings/sessions" element={<ActiveSessions />} />
                <Route path="settings/preferences" element={<Preferences />} />
              </Route>

              {/* ── Public Pages (with Header & Footer) ── */}
              <Route element={<UserLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/helpcenter" element={<HelpCenter />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/security" element={<Security />} />
              </Route>
            </Routes>
          </div>
        </Router>

        {/* Global Toaster */}
        <Toaster />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
