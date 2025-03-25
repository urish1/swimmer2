import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddSwimmerFormProps {
  onAddSwimmer: (name: string) => void;
}

export default function AddSwimmerForm({ onAddSwimmer }: AddSwimmerFormProps) {
  const [swimmerName, setSwimmerName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = swimmerName.trim();
    if (!trimmedName) {
      setError("Please enter a swimmer name");
      return;
    }
    
    setError("");
    onAddSwimmer(trimmedName);
    setSwimmerName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-md ml-4">
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Add Swimmer"
          value={swimmerName}
          onChange={(e) => setSwimmerName(e.target.value)}
          className="pr-12 py-2"
          aria-invalid={!!error}
        />
        <Button
          type="submit"
          className="absolute right-1 rounded-full w-8 h-8 p-0 flex items-center justify-center bg-primary text-white hover:bg-primary/90"
          aria-label="Add Swimmer"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </form>
  );
}
