import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export const Privacy = () => {
  return (
    <div className="flex flex-col min-h-screen pt-16 bg-background">
      {/* Header */}
      <section className="py-12 px-4 text-center bg-card border-b border-border/50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <ShieldCheck className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-3xl font-black tracking-tight text-foreground mb-4"
          >
            Privacy <span className="text-primary">Policy</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground font-semibold tracking-wider uppercase"
          >
            Last Updated: July 2026
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert max-w-none text-muted-foreground">
            <p className="text-lg leading-relaxed mb-8 text-foreground/90">
              At Cash Book, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you visit our website or use our mobile
              application. Please read this privacy policy carefully. If you do
              not agree with the terms of this privacy policy, please do not
              access the site.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              1. Collection of Your Information
            </h2>
            <p className="mb-4">
              We may collect information about you in a variety of ways. The
              information we may collect on the Site includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li>
                <strong>Personal Data:</strong> Personally identifiable
                information, such as your name, email address, and telephone
                number that you voluntarily give to us when you register with
                the Site.
              </li>
              <li>
                <strong>Financial Data:</strong> Data related to your
                transactions, account balances, and business ledgers that you
                input into the Cash Book platform. This data is heavily
                encrypted.
              </li>
              <li>
                <strong>Derivative Data:</strong> Information our servers
                automatically collect when you access the Site, such as your IP
                address, your browser type, your operating system, and your
                access times.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              2. Use of Your Information
            </h2>
            <p className="mb-4">
              Having accurate information about you permits us to provide you
              with a smooth, efficient, and customized experience. Specifically,
              we may use information collected about you via the Site to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li>Create and manage your account.</li>
              <li>Process your financial transactions and generate reports.</li>
              <li>Email you regarding your account or order.</li>
              <li>
                Improve our application functionality based on usage analytics.
              </li>
              <li>Increase the efficiency and operation of the Site.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              3. Disclosure of Your Information
            </h2>
            <p className="mb-4">
              We may share information we have collected about you in certain
              situations. Your information may be disclosed as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li>
                <strong>By Law or to Protect Rights:</strong> If we believe the
                release of information about you is necessary to respond to
                legal process, to investigate or remedy potential violations of
                our policies, or to protect the rights, property, and safety of
                others.
              </li>
              <li>
                <strong>Third-Party Service Providers:</strong> We may share
                your information with third parties that perform services for us
                or on our behalf, including data analysis, email delivery,
                hosting services, and customer service.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              4. Security of Your Information
            </h2>
            <p className="mb-8">
              We use administrative, technical, and physical security measures
              to help protect your personal information. While we have taken
              reasonable steps to secure the personal information you provide to
              us, please be aware that despite our efforts, no security measures
              are perfect or impenetrable, and no method of data transmission
              can be guaranteed against any interception or other type of
              misuse.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">
              5. Contact Us
            </h2>
            <p className="mb-4">
              If you have questions or comments about this Privacy Policy,
              please contact us at:
            </p>
            <div className="bg-card border border-border p-6 rounded-xl mt-4">
              <p className="font-semibold text-foreground">
                Cash Book Legal Team
              </p>
              <p>Email: legal@cashbook.com</p>
              <p>Address: 123 Finance Street, Tech District, 110001</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
