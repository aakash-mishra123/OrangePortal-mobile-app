import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  slug: text("slug").notNull().unique(),
  serviceCount: integer("service_count").default(0),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull(),
  categoryId: varchar("category_id").notNull().references(() => categories.id),
  hourlyRate: integer("hourly_rate").notNull(),
  monthlyRate: integer("monthly_rate").notNull(),
  features: text("features").array().notNull(),
  technologies: text("technologies").array().notNull(),
  imageUrl: text("image_url").notNull(),
  slug: text("slug").notNull().unique(),
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  serviceId: varchar("service_id").notNull().references(() => services.id),
  serviceName: text("service_name").notNull(),
  message: text("message"),
  createdAt: text("created_at").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  serviceCount: true,
});

export const insertServiceSchema = createInsertSchema(services);

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type Category = typeof categories.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Lead = typeof leads.$inferSelect;
