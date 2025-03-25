import { z } from "zod";

export const swimmerSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  lapCount: z.number().default(0),
});

export const insertSwimmerSchema = swimmerSchema.omit({ id: true });

export type InsertSwimmer = z.infer<typeof insertSwimmerSchema>;
export type Swimmer = z.infer<typeof swimmerSchema>;
