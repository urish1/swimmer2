import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Swimmer } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useSwimmers() {
  const { toast } = useToast();
  
  // Fetch all swimmers
  const { 
    data: swimmers = [], 
    isLoading,
    isError,
    error,
  } = useQuery<Swimmer[]>({
    queryKey: ['/api/swimmers'],
  });

  // Add a new swimmer
  const { mutate: addSwimmerMutation } = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", "/api/swimmers", { name, lapCount: 0 });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/swimmers'] });
    }
  });

  // Delete a swimmer
  const { mutate: deleteSwimmerMutation } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/swimmers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/swimmers'] });
      toast({
        description: "Swimmer removed"
      });
    }
  });

  // Increment lap count
  const { mutate: incrementLapMutation } = useMutation({
    mutationFn: async (id: number) => {
      const swimmer = swimmers.find(s => s.id === id);
      if (!swimmer) return;
      
      const res = await apiRequest("PATCH", `/api/swimmers/${id}`, {
        lapCount: swimmer.lapCount + 1
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/swimmers'] });
    }
  });

  // Decrement lap count
  const { mutate: decrementLapMutation } = useMutation({
    mutationFn: async (id: number) => {
      const swimmer = swimmers.find(s => s.id === id);
      if (!swimmer || swimmer.lapCount <= 0) return;
      
      const res = await apiRequest("PATCH", `/api/swimmers/${id}`, {
        lapCount: swimmer.lapCount - 1
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/swimmers'] });
    }
  });

  // Reset lap count
  const { mutate: resetLapMutation } = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/swimmers/${id}/reset`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/swimmers'] });
      toast({
        description: "Lap count reset to 0"
      });
    }
  });

  // If there's an error fetching swimmers, show a toast
  if (isError && error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load swimmers",
    });
  }

  return {
    swimmers,
    isLoading,
    addSwimmer: addSwimmerMutation,
    deleteSwimmer: deleteSwimmerMutation,
    incrementLap: incrementLapMutation,
    decrementLap: decrementLapMutation,
    resetLapCount: resetLapMutation
  };
}
