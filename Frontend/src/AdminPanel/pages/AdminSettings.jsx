import React, { useState } from 'react';
import { Settings, Shield, Bell, Save, CheckCircle2, Lock, Mail, Database } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminSettings = () => {
  const { toast } = useToast();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [enforce2FA, setEnforce2FA] = useState(false);
  const [supportEmail, setSupportEmail] = useState('support@cashbook.io');
  const [appName, setAppName] = useState('Cash Book');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Admin settings saved successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Admin System Settings</h1>
        <p className="text-sm text-muted-foreground">Configure global application parameters, security rules, and maintenance schedules.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* General App Settings */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">General Platform Configuration</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">Platform Name</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">Support Email Address</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
        </div>

        {/* Security & Maintenance Toggles */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Security & System Maintenance Controls</h3>
          </div>

          <div className="space-y-4">
            {/* Toggle 1: Maintenance Mode */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
              <div>
                <h4 className="text-sm font-bold text-foreground">System Maintenance Mode</h4>
                <p className="text-xs text-muted-foreground">Temporarily disable non-admin access for scheduled upgrades.</p>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-12 h-6 rounded-full transition-colors relative ${maintenanceMode ? 'bg-primary' : 'bg-muted'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${maintenanceMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {/* Toggle 2: Auto Backup */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
              <div>
                <h4 className="text-sm font-bold text-foreground">Automated Daily Database Backup</h4>
                <p className="text-xs text-muted-foreground">Store encrypted snapshots in cloud backup bucket every 24 hours.</p>
              </div>
              <button
                type="button"
                onClick={() => setAutoBackup(!autoBackup)}
                className={`w-12 h-6 rounded-full transition-colors relative ${autoBackup ? 'bg-primary' : 'bg-muted'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${autoBackup ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {/* Toggle 3: Enforce 2FA */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
              <div>
                <h4 className="text-sm font-bold text-foreground">Enforce Admin Two-Factor Authentication (2FA)</h4>
                <p className="text-xs text-muted-foreground">Require OTP verification for all admin level logins.</p>
              </div>
              <button
                type="button"
                onClick={() => setEnforce2FA(!enforce2FA)}
                className={`w-12 h-6 rounded-full transition-colors relative ${enforce2FA ? 'bg-primary' : 'bg-muted'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${enforce2FA ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-95 shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save System Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
