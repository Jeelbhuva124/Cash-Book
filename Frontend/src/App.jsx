import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ─── Context Providers ────────────────────────────────────
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// ─── Shared Components ────────────────────────────────────
import { Toaster } from './components/Toaster';

// ─── Landing Page ─────────────────────────────────────────
import { LandingPage } from './page/LandingPage';
import { About } from './page/About';
import { Services } from './page/Services';
import { Blog } from './page/Blog';
import { Contact } from './page/Contact';

// ─── Dashboard Pages ──────────────────────────────────────
import Landing from './Dashboard/pages/Home';
import Analytics from './Dashboard/pages/Analytics';
import Transactions from './Dashboard/pages/Transactions';
import Reports from './Dashboard/pages/Reports';
import Savings from './Dashboard/pages/Savings';
import Reminders from './Dashboard/pages/Reminders';
import Categories from './Dashboard/pages/Categories';
import Subcategories from './Dashboard/pages/Subcategories';
import PaymentModes from './Dashboard/pages/PaymentModes';
import Chalans from './Dashboard/pages/Chalans';
import Invitations from './Dashboard/pages/Invitations';
import Profile from './Dashboard/pages/Profile';

import { SettingsPage } from './Dashboard/pages/SettingsPage';
import { AiLayout } from './Dashboard/components/AiLayout';

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
          <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Routes>
              {/* ── Auth Pages ── */}
              <Route path="/login" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* ── AI Dashboard ── */}
              <Route path="/dashboard" element={<AiLayout />}>
                <Route index element={<Landing />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="accounts" element={<Landing />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="reports" element={<Reports />} />
                
                {/* Reference Dashboard Routes */}
                <Route path="chalans" element={<Chalans />} />
                <Route path="categories" element={<Categories />} />
                <Route path="subcategories" element={<Subcategories />} />
                <Route path="payment-modes" element={<PaymentModes />} />
                <Route path="invitations" element={<Invitations />} />
                <Route path="profile" element={<Profile />} />

                <Route path="budgets" element={<Landing />} />
                <Route path="savings" element={<Savings />} />
                <Route path="reminders" element={<Reminders />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* ── Public Pages (with Header & Footer) ── */}
              <Route element={<UserLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
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
