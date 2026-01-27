import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns,
  rows = 20,
}) => {
  return (
    <div className="w-full overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-background">
      {/* Header */}
      <div className="flex h-11 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {Array.from({ length: columns }).map((_, index) => (
          <div
            key={index}
            className="flex-1 px-4 flex items-center"
          >
            <Skeleton className="h-4 w-3/5" />
          </div>
        ))}
      </div>

      {/* Body */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex h-10 border-b last:border-b-0 border-gray-100 dark:border-gray-800"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="flex-1 px-4 flex items-center"
            >
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
