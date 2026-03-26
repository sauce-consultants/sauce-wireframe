import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  helperText?: string;
  error?: string;
  success?: string;
  size?: "sm" | "md" | "lg";
  leadingAdornment?: ReactNode;
  trailingAdornment?: ReactNode;
}

const sizeStyles = {
  sm: "h-10 px-3 text-sm",
  md: "h-12 px-3 text-base",
  lg: "h-14 px-4 text-lg",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      size = "md",
      leadingAdornment,
      trailingAdornment,
      id,
      className = "",
      ...props
    },
    ref
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const helperId = `${inputId}-helper`;
    const hasMessage = error || success || helperText;

    const borderColor = error
      ? "border-danger"
      : success
        ? "border-success"
        : "border-black";

    return (
      <div className={className}>
        <label htmlFor={inputId} className="block text-sm font-semibold mb-1.5">
          {label}
          {props.required && (
            <span className="text-danger ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <div className="relative flex items-center">
          {leadingAdornment && (
            <span className="absolute left-3 flex items-center text-text-muted">
              {leadingAdornment}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={hasMessage ? helperId : undefined}
            className={`
              w-full border-4 ${borderColor} bg-white
              ${sizeStyles[size]}
              ${leadingAdornment ? "pl-10" : ""}
              ${trailingAdornment ? "pr-10" : ""}
              transition-colors
              placeholder:text-text-muted
              focus:outline-none focus:border-accent
              disabled:opacity-50 disabled:bg-gray-light
              read-only:bg-gray-light read-only:cursor-default
            `}
            {...props}
          />
          {trailingAdornment && (
            <span className="absolute right-3 flex items-center text-text-muted">
              {trailingAdornment}
            </span>
          )}
        </div>
        {hasMessage && (
          <p
            id={helperId}
            className={`text-sm mt-1.5 ${
              error
                ? "text-danger"
                : success
                  ? "text-success"
                  : "text-text-muted"
            }`}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input, type InputProps };
