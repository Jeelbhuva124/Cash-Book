import React from "react";
import { motion } from "framer-motion";
import { Scale, FileText, ShieldCheck, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const legalDocuments = [
  {
    title: "Terms of Service",
    description:
      "The rules, guidelines, and agreements for using the Cash Book platform and services.",
    icon: Scale,
    link: "/terms",
    date: "Last updated: July 2026",
  },
  {
    title: "Privacy Policy",
    description:
      "How we collect, use, and protect your personal data and financial information.",
    icon: ShieldCheck,
    link: "/privacy",
    date: "Last updated: July 2026",
  },
  {
    title: "Cookie Policy",
    description:
      "Information about how we use cookies and similar technologies on our website.",
    icon: FileText,
    link: "/privacy", // Since we don't have a separate cookie policy, linking to privacy
    date: "Last updated: July 2026",
  },
];

export const Legal = () => {
  return (
    <div className="flex flex-col min-h-screen pt-16 bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center bg-card border-b border-border/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Scale className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-3xl font-black tracking-tight text-foreground mb-6"
          >
            Legal <span className="text-primary">Center</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Transparency and trust are fundamental to Cash Book. Here you can
            find all our legal documents, policies, and terms governing your use
            of our services.
          </motion.p>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-12 px-4 flex-grow">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legalDocuments.map((doc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={doc.link}
                  className="block h-full p-8 rounded-3xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <doc.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {doc.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                      {doc.date}
                    </span>
                    <span className="text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                      Read →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Disclaimer Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4 items-start"
          >
            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-500 mb-1">
                Legal Disclaimer
              </h4>
              <p className="text-sm text-amber-500/80 leading-relaxed">
                The information provided on this page and within our legal
                documents does not constitute legal advice. By using Cash Book,
                you agree to be bound by the terms outlined in these documents.
                We reserve the right to update these policies periodically.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
