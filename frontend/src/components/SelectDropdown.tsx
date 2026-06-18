import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder: string;
  error?: boolean;
}

export default function SelectDropdown({ value, onChange, options, placeholder, error }: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const [dropdownUp, setDropdownUp] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && containerRef.current && dropdownRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropdownUp(spaceBelow < 200 && spaceAbove > spaceBelow);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full pl-9 pr-9 py-3 bg-[#FFFCF8]/5 border ${error ? 'border-red-500' : 'border-[#FFFCF8]/10'} rounded-xl text-sm text-left focus:outline-none focus:border-[#C9A84C]/60 transition-colors cursor-pointer ${value ? 'text-[#FFFCF8]' : 'text-[#FFFCF8]/30'}`}
      >
        {value || placeholder}
      </button>
      <ChevronDown className={`absolute right-3 top-3.5 h-4 w-4 text-[#FFFCF8]/30 pointer-events-none transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute left-0 right-0 z-30 max-h-52 overflow-y-auto bg-[#1A1118] border border-[#C9A84C]/20 rounded-xl shadow-2xl shadow-black/50 ${dropdownUp ? 'bottom-full mb-1' : 'top-full mt-1'}`}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3.5 text-sm cursor-pointer transition-colors border-b border-[#FFFCF8]/5 last:border-b-0 ${
                value === opt
                  ? 'text-[#C9A84C] bg-[#C9A84C]/10 font-bold'
                  : 'text-[#FFFCF8] hover:bg-[#FFFCF8]/8'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
