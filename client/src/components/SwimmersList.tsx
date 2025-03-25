import { Swimmer } from "@shared/schema";
import SwimmerCard from "@/components/SwimmerCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Waves, MoveHorizontal } from "lucide-react";

interface SwimmersListProps {
  swimmers: Swimmer[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onReset: (id: number) => void;
}

export default function SwimmersList({ 
  swimmers, 
  isLoading,
  onDelete,
  onIncrement,
  onDecrement,
  onReset
}: SwimmersListProps) {

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-3 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-1/3" />
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <Skeleton className="h-16 w-16" />
                <Skeleton className="h-14 w-14 rounded-full ml-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (swimmers.length === 0) {
    return (
      <div className="space-y-3 mt-4">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <Waves className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-medium text-neutral-dark mb-2">
              No swimmers added yet
            </h2>
            <p className="text-gray-500 mb-4">
              Add your first swimmer using the form above
            </p>
            <div className="flex items-center justify-center text-sm text-gray-400 animate-pulse">
              <MoveHorizontal className="h-4 w-4 mr-1" />
              <span>Swipe left to delete, right to reset</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List of swimmers
  return (
    <div className="space-y-3 mt-4">
      {swimmers.map((swimmer) => (
        <SwimmerCard
          key={swimmer.id}
          swimmer={swimmer}
          onDelete={() => onDelete(swimmer.id)}
          onIncrement={() => onIncrement(swimmer.id)}
          onDecrement={() => onDecrement(swimmer.id)}
          onReset={() => onReset(swimmer.id)}
        />
      ))}
    </div>
  );
}
