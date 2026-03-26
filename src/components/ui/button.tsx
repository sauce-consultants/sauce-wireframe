import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Spinner } from "./spinner";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-black text-white border-4 border-black hover:bg-gray-dark active:scale-[0.98]",
  secondary:
    "bg-white text-black border-4 border-black hover:bg-gray-light active:scale-[0.98]",
  ghost:
    "bg-transparent text-black border-4 border-transparent hover:bg-gray-light active:scale-[0.98]",
  destructive:
    "bg-danger text-white border-4 border-danger hover:bg-red-600 active:scale-[0.98]",
  link: "bg-transparent text-black underline underline-offset-4 border-none hover:text-gray-dark p-0 h-auto",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-3 text-sm gap-1.5",
  md: "h-12 px-5 text-base gap-2",
  lg: "h-14 px-7 text-lg gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leadingIcon,
      trailingIcon,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={`
          inline-flex items-center justify-center font-semibold transition-colors
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
          disabled:opacity-50 disabled:pointer-events-none
          ${variantStyles[variant]}
          ${variant !== "link" ? sizeStyles[size] : ""}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <Spinner size={size === "sm" ? 16 : 20} />
        ) : (
          leadingIcon
        )}
        {children}
        {!loading && trailingIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
