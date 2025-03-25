import { swimmers, type Swimmer, type InsertSwimmer } from "@shared/schema";

export interface IStorage {
  getSwimmers(): Promise<Swimmer[]>;
  getSwimmer(id: number): Promise<Swimmer | undefined>;
  createSwimmer(swimmer: InsertSwimmer): Promise<Swimmer>;
  updateSwimmer(id: number, swimmer: Partial<Swimmer>): Promise<Swimmer | undefined>;
  deleteSwimmer(id: number): Promise<boolean>;
  resetLapCount(id: number): Promise<Swimmer | undefined>;
}

export class MemStorage implements IStorage {
  private swimmers: Map<number, Swimmer>;
  currentId: number;

  constructor() {
    this.swimmers = new Map();
    this.currentId = 1;
  }

  async getSwimmers(): Promise<Swimmer[]> {
    return Array.from(this.swimmers.values());
  }

  async getSwimmer(id: number): Promise<Swimmer | undefined> {
    return this.swimmers.get(id);
  }

  async createSwimmer(insertSwimmer: InsertSwimmer): Promise<Swimmer> {
    const id = this.currentId++;
    const swimmer: Swimmer = { ...insertSwimmer, id };
    this.swimmers.set(id, swimmer);
    return swimmer;
  }

  async updateSwimmer(id: number, updates: Partial<Swimmer>): Promise<Swimmer | undefined> {
    const swimmer = this.swimmers.get(id);
    if (!swimmer) return undefined;
    
    const updatedSwimmer = { ...swimmer, ...updates };
    this.swimmers.set(id, updatedSwimmer);
    return updatedSwimmer;
  }

  async deleteSwimmer(id: number): Promise<boolean> {
    return this.swimmers.delete(id);
  }

  async resetLapCount(id: number): Promise<Swimmer | undefined> {
    return this.updateSwimmer(id, { lapCount: 0 });
  }
}

export const storage = new MemStorage();
