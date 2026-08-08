import React from "react";
import { motion } from "framer-motion";

export const WeightHover = ({ text, className = "", defaultWeight = 400, hoverWeight = 800 }) => {
  return (
    <motion.span
      className={`inline-block origin-left ${className}`}
      initial={{ fontWeight: defaultWeight }}
      whileHover={{ fontWeight: hoverWeight, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ display: "inline-block" }}
    >
      {text}
    </motion.span>
  );
};
