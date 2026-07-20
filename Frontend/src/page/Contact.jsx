import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../context/ToastContext";

import { ContactSection } from "../components/ContactSection";

export const Contact = () => {

  return (
    <div className="flex flex-col min-h-screen pt-16 bg-background">
      <ContactSection />
    </div>
  );
};
