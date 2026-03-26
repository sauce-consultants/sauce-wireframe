import { type ReactNode } from "react";

/* Single Column */
function SingleColumn({
  children,
  width = "md",
  className = "",
}: {
  children: ReactNode;
  width?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const maxW = {
    sm: "max-w-lg",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
  }[width];

  return <div className={`${maxW} mx-auto ${className}`}>{children}</div>;
}

/* Dashboard Grid */
function DashboardGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 ${className}`}>
      {children}
    </div>
  );
}

/* Split View (Master–Detail) */
function SplitView({
  master,
  detail,
  className = "",
}: {
  master: ReactNode;
  detail: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col lg:flex-row h-full ${className}`}>
      <div className="lg:w-80 xl:w-96 border-b-4 lg:border-b-0 lg:border-r-4 border-black overflow-y-auto shrink-0">
        {master}
      </div>
      <div className="flex-1 overflow-y-auto">{detail}</div>
    </div>
  );
}

/* Main + Aside */
function MainAside({
  children,
  aside,
  className = "",
}: {
  children: ReactNode;
  aside: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col lg:flex-row gap-6 lg:gap-8 ${className}`}>
      <div className="flex-1 min-w-0">{children}</div>
      <div className="lg:w-72 xl:w-80 shrink-0">{aside}</div>
    </div>
  );
}

/* Centered Card (auth screens) */
function CenteredCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-md border-4 border-black bg-white p-8 shadow-lg ${className}`}>
        {children}
      </div>
    </div>
  );
}

export { SingleColumn, DashboardGrid, SplitView, MainAside, CenteredCard };
