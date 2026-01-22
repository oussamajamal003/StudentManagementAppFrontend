interface SkeletonProps {
  className?: string;
  count?: number;
}

export default function Skeleton({ className = "", count = 1 }: SkeletonProps) {
  if (count === 1) {
    return (
      <div 
        className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      />
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
        />
      ))}
    </>
  );
}
