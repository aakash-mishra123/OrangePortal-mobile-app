import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

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

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User table for authentication and tracking
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  mobile: varchar("mobile"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isGuest: integer("is_guest").default(0), // 0 = registered user, 1 = guest user
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User activity tracking for admin analytics
export const userActivities = pgTable("user_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  sessionId: varchar("session_id"), // For guest users without account
  activityType: varchar("activity_type").notNull(), // 'service_view', 'service_inquiry', 'category_browse', etc.
  serviceId: varchar("service_id").references(() => services.id),
  categoryId: varchar("category_id").references(() => categories.id),
  metadata: jsonb("metadata"), // Additional data like search terms, filters used, etc.
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id), // Link to user if logged in
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  serviceId: varchar("service_id").notNull().references(() => services.id),
  serviceName: text("service_name").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  activities: many(userActivities),
  leads: many(leads),
}));

export const userActivitiesRelations = relations(userActivities, ({ one }) => ({
  user: one(users, {
    fields: [userActivities.userId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [userActivities.serviceId],
    references: [services.id],
  }),
  category: one(categories, {
    fields: [userActivities.categoryId],
    references: [categories.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  user: one(users, {
    fields: [leads.userId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [leads.serviceId],
    references: [services.id],
  }),
}));

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  serviceCount: true,
});

export const insertServiceSchema = createInsertSchema(services);

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserActivitySchema = createInsertSchema(userActivities).omit({
  id: true,
  createdAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

// Upsert schema for user authentication
export const upsertUserSchema = createInsertSchema(users);

// Types
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type Category = typeof categories.$inferSelect;
export type Service = typeof services.$inferSelect;
export type User = typeof users.$inferSelect;
export type UserActivity = typeof userActivities.$inferSelect;
export type Lead = typeof leads.$inferSelect;
