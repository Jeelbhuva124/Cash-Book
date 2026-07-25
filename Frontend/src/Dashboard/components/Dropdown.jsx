import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dropdown = ({ value, onChange, className = '', selectClassName = '', onAddNew, children, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Reset search term when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

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

  const filteredOptions = options.filter(opt => {
    // Always keep disabled headers / instructions visible
    if (opt.disabled) return true;
    return String(opt.label).toLowerCase().includes(searchTerm.toLowerCase());
  });

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
            {/* Search Input Bar */}
            <div className="p-2 border-b border-border/60 bg-muted/10">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()} // prevent dropdown click-outside closes
                className="w-full px-3 py-1.5 text-xs border border-border bg-white dark:bg-card rounded-lg focus:outline-none focus:border-primary font-normal text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="max-h-[200px] overflow-y-auto py-1.5 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-center text-xs text-muted-foreground font-semibold">
                  No matching options.
                </div>
              ) : (
                filteredOptions.map((opt, i) => {
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
                })
              )}

              {/* Dynamic Add Option Trigger */}
              {filteredOptions.length === 0 && searchTerm.trim() && onAddNew && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddNew(searchTerm.trim());
                    setIsOpen(false);
                  }}
                  className="px-4 py-2.5 flex items-center justify-between text-[13.5px] cursor-pointer hover:bg-[#848bc7]/15 dark:hover:bg-muted/50 text-[#848bc7] font-bold border-t border-border/40 mt-1.5"
                >
                  <span className="truncate flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Add "{searchTerm}"
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
