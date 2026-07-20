import React from "react";
import { Wallet, PieChart, Bell, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Services = () => {
  const services = [
    {
      icon: Wallet,
      title: "Expense Tracking",
      desc: "Log daily expenses in seconds. Categorize, tag, and organize your spending to see exactly where your money goes.",
      color: "text-expense",
      bg: "bg-expense/10",
    },
    {
      icon: PieChart,
      title: "Smart Analytics",
      desc: "Visualize your financial health with interactive charts. Identify spending trends and adjust your budget accordingly.",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Bell,
      title: "Bill Reminders",
      desc: "Never miss a due date. Set recurring reminders for bills and subscriptions to avoid late fees.",
      color: "text-brand",
      bg: "bg-brand/10",
    },
    {
      icon: FileText,
      title: "Tax Reporting",
      desc: "Generate clean, professional PDF reports of your income and expenses, ready for tax season.",
      color: "text-income",
      bg: "bg-income/10",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-16 bg-background">
      <section className="py-12 px-4 text-center max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-3xl font-black tracking-tight text-foreground mb-6"
        >
          Everything You Need to <br />{" "}
          <span className="text-primary">Manage Wealth</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground leading-relaxed"
        >
          Discover our suite of financial tools designed to give you complete
          control over your money.
        </motion.p>
      </section>

      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 bg-card border border-border rounded-3xl shadow-lg shadow-background hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-125"></div>
                <div
                  className={`w-14 h-14 ${service.bg} rounded-2xl flex items-center justify-center ${service.color} mb-6`}
                >
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {service.desc}
                </p>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
