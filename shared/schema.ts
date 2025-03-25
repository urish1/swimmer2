import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const swimmers = pgTable("swimmers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  lapCount: integer("lap_count").notNull().default(0),
});

export const insertSwimmerSchema = createInsertSchema(swimmers).omit({
  id: true,
});

export type InsertSwimmer = z.infer<typeof insertSwimmerSchema>;
export type Swimmer = typeof swimmers.$inferSelect;
