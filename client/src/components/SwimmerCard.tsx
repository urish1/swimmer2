import { useState, useRef } from "react";
import { Swimmer } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Trash, RefreshCw, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface SwimmerCardProps {
  swimmer: Swimmer;
  onDelete: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}

export default function SwimmerCard({
  swimmer,
  onDelete,
  onIncrement,
  onDecrement,
  onReset,
}: SwimmerCardProps) {
  // Track swipe state
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Constants for swipe thresholds
  const swipeThreshold = 100;
  
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (_: any, info: { offset: { x: number } }) => {
    const offsetX = info.offset.x;
    setDragX(offsetX);
    
    if (offsetX < -20) {
      setSwipeDirection("left");
    } else if (offsetX > 20) {
      setSwipeDirection("right");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const offsetX = info.offset.x;
    
    if (offsetX < -swipeThreshold) {
      // Left swipe - delete
      onDelete();
      // No need to reset position as card will be removed
    } else if (offsetX > swipeThreshold) {
      // Right swipe - reset
      onReset();
      // Animate back to original position after operation
      setDragX(0);
    } else {
      // Not enough distance, reset position
      setDragX(0);
    }
    
    setIsDragging(false);
    setSwipeDirection(null);
  };

  // Handle lap decrement button
  const handleDecrement = () => {
    if (swimmer.lapCount > 0) {
      onDecrement();
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Delete indicator */}
      <div className={`absolute inset-y-0 left-0 bg-danger text-white flex items-center px-6 h-full pointer-events-none transition-opacity ${swipeDirection === "left" ? "opacity-100" : "opacity-0"}`}>
        <Trash className="h-5 w-5 mr-2" />
        <span>Delete</span>
      </div>
      
      {/* Reset indicator */}
      <div className={`absolute inset-y-0 right-0 bg-warning text-white flex items-center px-6 h-full pointer-events-none transition-opacity ${swipeDirection === "right" ? "opacity-100" : "opacity-0"}`}>
        <span>Reset</span>
        <RefreshCw className="h-5 w-5 ml-2" />
      </div>
      
      {/* Card content with swipe functionality */}
      <motion.div
        ref={cardRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{ x: dragX }}
        className={`bg-white rounded-lg shadow-sm overflow-hidden touch-pan-x`}
      >
        <div className="p-4 flex items-center justify-between bg-white">
          <div className="flex-1">
            <h3 className="text-lg font-medium">{swimmer.name}</h3>
          </div>
          <div className="flex items-center">
            <Button 
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              className="h-10 w-10 rounded-full mr-3"
              aria-label="Decrease lap count"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <div className="text-center w-16">
              <div className="text-2xl font-bold text-primary">{swimmer.lapCount}</div>
              <div className="text-xs text-gray-500">laps</div>
            </div>
            
            <Button 
              variant="default"
              size="icon"
              onClick={onIncrement}
              className="h-14 w-14 rounded-full ml-3 bg-accent hover:bg-accent/90 text-white"
              aria-label="Increase lap count"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
