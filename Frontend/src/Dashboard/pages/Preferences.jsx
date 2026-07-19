import React, { useState } from 'react';
import { Palette, BookOpen, Globe, ListOrdered, Save } from 'lucide-react';
import Dropdown from '../components/Dropdown';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/currencyFormatter';

export const Preferences = () => {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const isDarkMode = theme === 'dark';

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('pref_notificationsEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  
  const [currencyFormat, setCurrencyFormat] = useState(() => {
    return localStorage.getItem('pref_currencyFormat') || 'full';
  });
  
  const [defaultCashbook, setDefaultCashbook] = useState(() => {
    return localStorage.getItem('pref_defaultCashbook') || '';
  });
  
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('pref_language') || 'en';
  });

  const previewAmount = formatCurrency(1500000, currencyFormat);
  
  const handleSave = () => {
    localStorage.setItem('pref_notificationsEnabled', notificationsEnabled);
    localStorage.setItem('pref_currencyFormat', currencyFormat);
    localStorage.setItem('pref_defaultCashbook', defaultCashbook);
    localStorage.setItem('pref_language', language);
    
    // Dispatch a custom event so other components could listen to changes if needed
    window.dispatchEvent(new Event('preferencesUpdated'));
    
    addToast("Preferences saved successfully!", "success");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-foreground relative pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Preferences</h1>
        <p className="text-muted-foreground text-sm">Customize your app experience</p>
      </div>

      <div className="space-y-6">
        {/* Appearance Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Appearance & Alerts</h2>
          </div>
          <p className="text-muted-foreground text-sm mb-6">Customize the look and feel and notifications</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Dark Mode</span>
              {/* Toggle Switch */}
              <button 
                onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${isDarkMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Notifications</span>
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${notificationsEnabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Default Settings Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Default Settings</h2>
          </div>
          <p className="text-muted-foreground text-sm mb-6">Set your default preferences</p>

          <div className="space-y-5">
            <div>
              <label className="block font-medium text-sm mb-2">Default Cashbook</label>
              <Dropdown 
                value={defaultCashbook} 
                onChange={(e) => setDefaultCashbook(e.target.value)}
              >
                <option value="" disabled>Select Cashbook</option>
                <option value="personal">Personal Wallet</option>
                <option value="business">Business Account</option>
                <option value="savings">Savings</option>
              </Dropdown>
            </div>
            
            <div>
              <label className="block font-medium text-sm mb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Language
              </label>
              <Dropdown 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="es">Spanish (Español)</option>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Currency Format Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <ListOrdered className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Currency Format</h2>
          </div>
          <p className="text-muted-foreground text-sm mb-6">Choose how large amounts are displayed</p>

          <div className="border border-dashed border-border rounded-xl p-6 text-center mb-6 bg-muted/20 transition-all duration-300">
            <p className="text-sm text-muted-foreground mb-1">Sample Balance Preview</p>
            <p className="text-3xl font-bold transition-all duration-300">{previewAmount}</p>
          </div>

          <div className="space-y-3">
            {/* Option 1 */}
            <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${currencyFormat === 'international' ? 'border-primary bg-primary/5' : 'border-border/50 hover:bg-muted/30'}`}>
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <input 
                    type="radio" 
                    name="currencyFormat" 
                    value="international"
                    checked={currencyFormat === 'international'}
                    onChange={() => setCurrencyFormat('international')}
                    className="w-4 h-4 accent-primary cursor-pointer" 
                  />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">International (K, M, B)</p>
                  <p className="text-xs text-muted-foreground">Used globally: Thousands, Millions, Billions</p>
                </div>
              </div>
              <span className="text-xs font-semibold bg-background text-foreground border border-border px-2 py-1 rounded">₹ 1.5 M</span>
            </label>

            {/* Option 2 */}
            <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${currencyFormat === 'indian' ? 'border-primary bg-primary/5' : 'border-border/50 hover:bg-muted/30'}`}>
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <input 
                    type="radio" 
                    name="currencyFormat" 
                    value="indian"
                    checked={currencyFormat === 'indian'}
                    onChange={() => setCurrencyFormat('indian')}
                    className="w-4 h-4 accent-primary cursor-pointer" 
                  />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Indian (K, L, Cr)</p>
                  <p className="text-xs text-muted-foreground">Used in India: Thousands, Lakhs, Crores</p>
                </div>
              </div>
              <span className="text-xs font-semibold bg-background text-foreground border border-border px-2 py-1 rounded">₹ 15.0 L</span>
            </label>

            {/* Option 3 */}
            <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${currencyFormat === 'full' ? 'border-primary bg-primary/5' : 'border-border/50 hover:bg-muted/30'}`}>
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <input 
                    type="radio" 
                    name="currencyFormat" 
                    value="full"
                    checked={currencyFormat === 'full'}
                    onChange={() => setCurrencyFormat('full')}
                    className="w-4 h-4 accent-primary cursor-pointer" 
                  />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Full Amount</p>
                  <p className="text-xs text-muted-foreground">Show complete numbers without abbreviations</p>
                </div>
              </div>
              <span className="text-xs font-semibold bg-background text-foreground border border-border px-2 py-1 rounded">₹ 15,00,000</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Sticky Save Button */}
      <div className="fixed bottom-6 right-6 z-40">
         <button 
           onClick={handleSave}
           className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
         >
           <Save className="w-4 h-4" />
           Save Preferences
         </button>
      </div>
    </div>
  );
};
