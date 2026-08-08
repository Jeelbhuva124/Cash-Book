import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const DirectionHover = ({ text, hoverText, className = "" }) => {
  const ref = useRef(null);
  const [direction, setDirection] = useState("bottom");
  const [isHovered, setIsHovered] = useState(false);

  const getDirection = (e, obj) => {
    const { width, height, left, top } = obj.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    const angle = Math.atan2(y, x);
    let d = Math.round((angle * 180) / Math.PI / 90 + 5) % 4;
    return d; // 0: Right, 1: Bottom, 2: Left, 3: Top
  };

  const handleMouseEnter = (e) => {
    if (!ref.current) return;
    const dir = getDirection(e, ref.current);
    switch (dir) {
      case 0: setDirection("right"); break;
      case 1: setDirection("bottom"); break;
      case 2: setDirection("left"); break;
      case 3: setDirection("top"); break;
      default: setDirection("bottom");
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const variants = {
    initial: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : "0%",
      y: direction === "top" ? "-100%" : direction === "bottom" ? "100%" : "0%",
      opacity: 0
    },
    animate: {
      x: "0%",
      y: "0%",
      opacity: 1
    },
    exit: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : "0%",
      y: direction === "top" ? "-100%" : direction === "bottom" ? "100%" : "0%",
      opacity: 0
    },
  };

  const mainVariants = {
    initial: { x: "0%", y: "0%", opacity: 1 },
    animate: { 
      x: direction === "left" ? "100%" : direction === "right" ? "-100%" : "0%",
      y: direction === "top" ? "100%" : direction === "bottom" ? "-100%" : "0%",
      opacity: 0
    },
    exit: { x: "0%", y: "0%", opacity: 1 }
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden inline-flex items-center justify-center ${className}`}
    >
      <motion.div
        animate={isHovered ? "animate" : "initial"}
        variants={mainVariants}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="relative z-10"
      >
        {text}
      </motion.div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="absolute inset-0 z-20 flex items-center justify-center text-primary"
          >
            {hoverText || text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
