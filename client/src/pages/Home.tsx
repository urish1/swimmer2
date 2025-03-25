import { useToast } from "@/hooks/use-toast";
import AddSwimmerForm from "@/components/AddSwimmerForm";
import SwimmersList from "@/components/SwimmersList";
import { useSwimmers } from "@/hooks/use-swimmers";
import { Pool } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const { 
    swimmers, 
    isLoading, 
    addSwimmer
  } = useSwimmers();

  const handleAddSwimmer = async (name: string) => {
    try {
      await addSwimmer(name);
      toast({
        description: `${name} added successfully!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add swimmer",
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* App Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary flex items-center">
              <Pool className="mr-2 h-6 w-6" />
              SwimTracker
            </h1>
            <AddSwimmerForm onAddSwimmer={handleAddSwimmer} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-6">
        <SwimmersList 
          swimmers={swimmers} 
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
