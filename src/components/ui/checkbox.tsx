"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { Check, Minus } from "lucide-react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  helperText?: string;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, indeterminate = false, className = "", ...props }, ref) => {
    const inputId = props.id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <label
          htmlFor={inputId}
          className="relative flex items-center justify-center h-6 w-6 shrink-0 cursor-pointer"
        >
          <input
            ref={(el) => {
              if (el) el.indeterminate = indeterminate;
              if (typeof ref === "function") ref(el);
              else if (ref) ref.current = el;
            }}
            type="checkbox"
            id={inputId}
            className="peer sr-only"
            {...props}
          />
          <span
            className={`
              h-6 w-6 border-4 border-black flex items-center justify-center
              transition-colors
              peer-checked:bg-black peer-checked:text-white
              peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent
              peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
              ${indeterminate ? "bg-black text-white" : ""}
            `}
          >
            {indeterminate ? (
              <Minus size={16} strokeWidth={3} />
            ) : (
              <Check size={16} strokeWidth={3} className="hidden peer-checked:block" />
            )}
          </span>
        </label>
        <div>
          <label htmlFor={inputId} className="text-base cursor-pointer select-none">
            {label}
          </label>
          {helperText && (
            <p className="text-sm text-text-muted mt-0.5">{helperText}</p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
export { Checkbox, type CheckboxProps };
