import { useEffect, useState } from "react";
import { Swimmer, InsertSwimmer, swimmerSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Local storage key
const SWIMMERS_STORAGE_KEY = 'swimmers-data';

// Custom hook for managing swimmers data
// Make sure it's a named export with a consistent definition
export function useSwimmers() {
  const { toast } = useToast();
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load swimmers from localStorage on component mount
  useEffect(() => {
    try {
      const storedSwimmers = localStorage.getItem(SWIMMERS_STORAGE_KEY);
      if (storedSwimmers) {
        // Parse and validate the data
        const parsedSwimmers = JSON.parse(storedSwimmers);
        const validSwimmers = parsedSwimmers.filter((swimmer: unknown) => 
          swimmerSchema.safeParse(swimmer).success
        );
        setSwimmers(validSwimmers);
      }
    } catch (error) {
      console.error("Failed to load swimmers from localStorage:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load swimmers from storage"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Save swimmers to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(SWIMMERS_STORAGE_KEY, JSON.stringify(swimmers));
    }
  }, [swimmers, isLoading]);

  // Add a new swimmer
  const addSwimmer = (name: string) => {
    try {
      const newSwimmer: Swimmer = {
        id: Date.now(), // Use timestamp as unique ID
        name,
        lapCount: 0
      };
      
      setSwimmers(prevSwimmers => [...prevSwimmers, newSwimmer]);
      
      toast({
        description: `${name} added successfully`
      });
    } catch (error) {
      console.error("Failed to add swimmer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add swimmer"
      });
    }
  };

  // Delete a swimmer
  const deleteSwimmer = (id: number) => {
    try {
      // First we update the state
      setSwimmers(prevSwimmers => prevSwimmers.filter(swimmer => swimmer.id !== id));
      
      // Then we save to localStorage directly to ensure persistence
      const remainingSwimmers = swimmers.filter(swimmer => swimmer.id !== id);
      localStorage.setItem(SWIMMERS_STORAGE_KEY, JSON.stringify(remainingSwimmers));
      
      toast({
        description: "Swimmer removed"
      });
    } catch (error) {
      console.error("Failed to delete swimmer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete swimmer"
      });
    }
  };

  // Increment lap count
  const incrementLap = (id: number) => {
    try {
      // Update state with the increment
      const updatedSwimmers = swimmers.map(swimmer => 
        swimmer.id === id 
          ? { ...swimmer, lapCount: swimmer.lapCount + 1 } 
          : swimmer
      );
      
      setSwimmers(updatedSwimmers);
      
      // Update localStorage
      localStorage.setItem(SWIMMERS_STORAGE_KEY, JSON.stringify(updatedSwimmers));
    } catch (error) {
      console.error("Failed to increment lap count:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lap count"
      });
    }
  };

  // Decrement lap count
  const decrementLap = (id: number) => {
    try {
      // Update state with the decrement, preventing negative counts
      const updatedSwimmers = swimmers.map(swimmer => 
        swimmer.id === id && swimmer.lapCount > 0
          ? { ...swimmer, lapCount: swimmer.lapCount - 1 } 
          : swimmer
      );
      
      setSwimmers(updatedSwimmers);
      
      // Update localStorage
      localStorage.setItem(SWIMMERS_STORAGE_KEY, JSON.stringify(updatedSwimmers));
    } catch (error) {
      console.error("Failed to decrement lap count:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lap count"
      });
    }
  };

  // Reset lap count
  const resetLapCount = (id: number) => {
    try {
      // Update state
      const updatedSwimmers = swimmers.map(swimmer => 
        swimmer.id === id 
          ? { ...swimmer, lapCount: 0 } 
          : swimmer
      );
      
      setSwimmers(updatedSwimmers);
      
      // Ensure localStorage is updated
      localStorage.setItem(SWIMMERS_STORAGE_KEY, JSON.stringify(updatedSwimmers));
      
      toast({
        description: "Lap count reset to 0"
      });
    } catch (error) {
      console.error("Failed to reset lap count:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset lap count"
      });
    }
  };

  return {
    swimmers,
    isLoading,
    addSwimmer,
    deleteSwimmer,
    incrementLap,
    decrementLap,
    resetLapCount
  };
}
