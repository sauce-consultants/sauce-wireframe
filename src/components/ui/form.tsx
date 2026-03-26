import { type ReactNode, type FormHTMLAttributes } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

function Form({ children, className = "", ...props }: FormProps) {
  return (
    <form className={`max-w-2xl ${className}`} {...props}>
      {children}
    </form>
  );
}

function FormSection({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-6 pt-8 first:pt-0 ${className}`}>
      {title && <h3 className="text-lg font-extrabold">{title}</h3>}
      {children}
    </div>
  );
}

function FormFieldGroup({
  children,
  columns = 1,
  className = "",
}: {
  children: ReactNode;
  columns?: 1 | 2;
  className?: string;
}) {
  return (
    <div
      className={`${
        columns === 2
          ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
          : "flex flex-col gap-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function FormActions({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-end gap-3 pt-6 border-t-4 border-black mt-8 ${className}`}>
      {children}
    </div>
  );
}

export { Form, FormSection, FormFieldGroup, FormActions };
