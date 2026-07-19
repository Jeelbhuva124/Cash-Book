import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = ({ value, onChange, className = '', selectClassName = '', children, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Extract options from standard <option> children
  const options = React.Children.toArray(children).map(child => {
    if (child.type === 'option') {
      return { 
        value: child.props.value, 
        label: child.props.children, 
        disabled: child.props.disabled 
      };
    }
    return null;
  }).filter(Boolean);

  const selectedOption = options.find(opt => String(opt.value) === String(value));
  const displayLabel = selectedOption ? selectedOption.label : (options[0]?.label || 'Select...');

  const handleSelect = (opt) => {
    if (opt.disabled) return;
    
    // Create a synthetic event to match standard native onChange behavior
    if (onChange) {
      onChange({ target: { value: opt.value } });
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Custom UI Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-[#fcfcfc] dark:bg-card border ${
          isOpen ? 'border-[#848bc7] ring-2 ring-[#848bc7]/20' : 'border-border/80'
        } rounded-xl text-[13.5px] text-foreground shadow-sm cursor-pointer transition-all duration-200 select-none ${selectClassName}`}
      >
        <span className={`truncate ${!selectedOption || selectedOption.disabled ? 'text-muted-foreground' : 'font-medium text-[#1e293b] dark:text-foreground'}`}>
          {displayLabel}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Custom UI Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full mt-1.5 bg-white dark:bg-card border border-border/80 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden"
          >
            <div className="max-h-[240px] overflow-y-auto py-1.5 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              {options.map((opt, i) => {
                const isSelected = String(opt.value) === String(value);
                
                return (
                  <div
                    key={i}
                    onClick={() => handleSelect(opt)}
                    className={`
                      px-4 py-2.5 flex items-center justify-between text-[13.5px] transition-colors
                      ${opt.disabled 
                        ? 'text-muted-foreground/60 cursor-not-allowed bg-muted/10' 
                        : 'cursor-pointer hover:bg-[#848bc7]/10 dark:hover:bg-muted/40'}
                      ${isSelected 
                        ? 'bg-[#848bc7]/5 text-[#2b3674] dark:text-[#848bc7] font-bold' 
                        : 'text-foreground font-medium'}
                    `}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && !opt.disabled && (
                      <Check className="w-4 h-4 text-[#848bc7]" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
