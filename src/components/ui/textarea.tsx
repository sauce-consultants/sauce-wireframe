import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  error?: string;
  maxLength?: number;
  currentLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      maxLength,
      currentLength,
      id,
      className = "",
      ...props
    },
    ref
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const helperId = `${inputId}-helper`;
    const hasMessage = error || helperText;

    return (
      <div className={className}>
        <label htmlFor={inputId} className="block text-sm font-semibold mb-1.5">
          {label}
          {props.required && (
            <span className="text-danger ml-1" aria-hidden="true">*</span>
          )}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          rows={props.rows ?? 4}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? helperId : undefined}
          className={`
            w-full border-4 ${error ? "border-danger" : "border-black"} bg-white
            px-3 py-2 text-base resize-y min-h-24
            transition-colors placeholder:text-text-muted
            focus:outline-none focus:border-accent
            disabled:opacity-50 disabled:bg-gray-light
          `}
          {...props}
        />
        <div className="flex justify-between mt-1.5">
          {hasMessage ? (
            <p id={helperId} className={`text-sm ${error ? "text-danger" : "text-text-muted"}`}>
              {error || helperText}
            </p>
          ) : <span />}
          {maxLength != null && (
            <span className="text-xs font-mono text-text-muted">
              {currentLength ?? 0}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea, type TextareaProps };
