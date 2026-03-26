interface SkeletonProps {
  className?: string;
  circle?: boolean;
}

function Skeleton({ className = "", circle = false }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`
        bg-gray-light animate-pulse
        ${circle ? "rounded-full" : ""}
        ${className}
      `}
    />
  );
}

export { Skeleton, type SkeletonProps };
