import { type ReactNode, type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
  className?: string;
}

function Card({ children, interactive = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`
        border-4 border-black bg-white overflow-hidden
        ${interactive ? "hover:shadow-md transition-shadow cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 pt-5 pb-2 ${className}`}>{children}</div>;
}

function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-5 py-2 ${className}`}>{children}</div>;
}

function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`px-5 pt-2 pb-5 flex items-center gap-3 ${className}`}>
      {children}
    </div>
  );
}

function CardMedia({ className = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <div className={`w-full h-48 bg-gray-light ${className}`}><img className="w-full h-full object-cover" {...props} /></div>;
}

export { Card, CardHeader, CardBody, CardFooter, CardMedia };
