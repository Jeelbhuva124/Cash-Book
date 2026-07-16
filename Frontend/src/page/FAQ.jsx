import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "What is Cash Book?",
    answer: "Cash Book is a comprehensive digital ledger designed to help you track your daily expenses, manage business cash flow, and maintain digital khata seamlessly."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, absolute security is our top priority. We use bank-grade encryption to protect all your financial data and transactions. Your data is stored securely in the cloud."
  },
  {
    question: "Can I generate PDF/Excel reports?",
    answer: "Absolutely! You can download your transaction history and account ledgers in both PDF and Excel formats with just a single click from the Reports dashboard."
  },
  {
    question: "Is the app free to use?",
    answer: "We offer a fully functional free tier for standard users. For businesses requiring advanced analytics, multi-user access, and priority support, we have premium plans available."
  },
  {
    question: "Can I use Cash Book offline?",
    answer: "While Cash Book works best with an active internet connection to sync your data to the cloud, basic transaction entries can be queued and will automatically sync once you are back online."
  },
  {
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. An OTP will be sent to your registered email address to verify your identity."
  }
];

export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen pt-16 bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
        >
          <HelpCircle className="w-8 h-8 text-primary" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6"
        >
          Frequently Asked <span className="text-primary">Questions</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground leading-relaxed"
        >
          Have questions? We're here to help. Find answers to common questions about our platform and services below.
        </motion.p>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-12 bg-card border-t border-b border-border/50 flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border border-border rounded-xl bg-background overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="text-base font-semibold text-foreground">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 text-sm text-muted-foreground leading-relaxed border-t border-border/50 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center bg-background border border-border p-8 rounded-2xl"
          >
            <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Still have questions?</h3>
            <p className="text-sm text-muted-foreground mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
            <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-primary-foreground bg-primary hover:opacity-90 transition-opacity">
              Get in touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
