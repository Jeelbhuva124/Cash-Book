import React from 'react';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

export const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen pt-16 bg-background">
      {/* Header */}
      <section className="py-20 px-4 text-center bg-card border-b border-border/50">
        <div className="max-w-3xl mx-auto">
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
            className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4"
          >
            Terms of <span className="text-primary">Service</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground font-semibold tracking-wider uppercase"
          >
            Effective Date: July 15, 2026
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 flex-grow">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert max-w-none text-muted-foreground">
            
            <p className="text-lg leading-relaxed mb-8 text-foreground/90">
              Welcome to Cash Book. These Terms of Service outline the rules and regulations for the use of our website and mobile application. By accessing this service we assume you accept these terms and conditions in full. Do not continue to use Cash Book if you do not accept all of the terms and conditions stated on this page.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">1. Definitions</h2>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li><strong>"Service"</strong> refers to the Cash Book application and website.</li>
              <li><strong>"User", "You", and "Your"</strong> refers to you, the person accessing this Service and accepting the Company's terms.</li>
              <li><strong>"The Company", "Ourselves", "We", "Our" and "Us"</strong>, refers to Cash Book Inc.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">2. License</h2>
            <p className="mb-4">
              Unless otherwise stated, Cash Book and/or its licensors own the intellectual property rights for all material on Cash Book. All intellectual property rights are reserved. You may view and/or print pages from our service for your own personal use subject to restrictions set in these terms and conditions.
            </p>
            <p className="mb-8">
              You must not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-8">
              <li>Republish material from Cash Book without prior consent.</li>
              <li>Sell, rent, or sub-license material from Cash Book.</li>
              <li>Reproduce, duplicate or copy material from Cash Book.</li>
              <li>Redistribute content from Cash Book (unless content is specifically made for redistribution).</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">3. User Responsibilities</h2>
            <p className="mb-8">
              As a user of our Service, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or mobile device. You agree to accept responsibility for all activities that occur under your account or password. We reserve the right to refuse service, terminate accounts, or remove or edit content in our sole discretion.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">4. Limitation of Liability</h2>
            <p className="mb-8">
              In no event shall Cash Book, nor any of its officers, directors, and employees, be liable to you for anything arising out of or in any way connected with your use of this Service, whether such liability is under contract, tort or otherwise. Cash Book, including its officers, directors, and employees, shall not be liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this Service.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-4">5. Governing Law & Jurisdiction</h2>
            <p className="mb-8">
              These Terms will be governed by and interpreted in accordance with the laws of the State/Country in which Cash Book is officially registered, and you submit to the non-exclusive jurisdiction of the state and federal courts located in that jurisdiction for the resolution of any disputes.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
};
