import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Spinner } from "./spinner";

type IconButtonVariant = "default" | "destructive" | "ghost";
type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  "aria-label": string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default:
    "bg-transparent text-black border-4 border-black hover:bg-gray-light active:scale-[0.98]",
  destructive:
    "bg-transparent text-danger border-4 border-danger hover:bg-danger hover:text-white active:scale-[0.98]",
  ghost:
    "bg-transparent text-black border-4 border-transparent hover:bg-gray-light active:scale-[0.98]",
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = "default",
      size = "md",
      loading = false,
      disabled,
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
          inline-flex items-center justify-center transition-colors
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
          disabled:opacity-50 disabled:pointer-events-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {loading ? <Spinner size={size === "sm" ? 16 : 20} /> : icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
export { IconButton, type IconButtonProps };
