import React from 'react';

interface InputProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  icon?: React.ReactNode;
}

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  min,
  max,
  icon
}: InputProps) => {
  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative rounded-xl shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {icon}
            </div>
          </div>
        )}
        <input
          type={type}
          required={required}
          min={min}
          max={max}
          className={`
            block w-full py-2.5 
            ${icon ? 'pl-10' : 'pl-4'} pr-4 
            border border-gray-200 dark:border-gray-700 
            rounded-xl 
            bg-gray-50 dark:bg-gray-800 
            text-gray-900 dark:text-white 
            placeholder-gray-400 
            focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
            transition-all duration-200
            sm:text-sm
          `}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Input;
