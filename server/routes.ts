import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSwimmerSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all swimmers
  app.get("/api/swimmers", async (req, res) => {
    try {
      const swimmers = await storage.getSwimmers();
      res.json(swimmers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch swimmers" });
    }
  });

  // Get a specific swimmer
  app.get("/api/swimmers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const swimmer = await storage.getSwimmer(id);
      if (!swimmer) {
        return res.status(404).json({ message: "Swimmer not found" });
      }
      res.json(swimmer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch swimmer" });
    }
  });

  // Create a new swimmer
  app.post("/api/swimmers", async (req, res) => {
    try {
      const swimmerData = insertSwimmerSchema.parse(req.body);
      const swimmer = await storage.createSwimmer(swimmerData);
      res.status(201).json(swimmer);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid swimmer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create swimmer" });
    }
  });

  // Update a swimmer (used for incrementing/decrementing lap count)
  app.patch("/api/swimmers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const swimmer = await storage.updateSwimmer(id, updates);
      if (!swimmer) {
        return res.status(404).json({ message: "Swimmer not found" });
      }
      res.json(swimmer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update swimmer" });
    }
  });

  // Delete a swimmer
  app.delete("/api/swimmers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSwimmer(id);
      if (!success) {
        return res.status(404).json({ message: "Swimmer not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete swimmer" });
    }
  });

  // Reset a swimmer's lap count
  app.post("/api/swimmers/:id/reset", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const swimmer = await storage.resetLapCount(id);
      if (!swimmer) {
        return res.status(404).json({ message: "Swimmer not found" });
      }
      res.json(swimmer);
    } catch (error) {
      res.status(500).json({ message: "Failed to reset lap count" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
