import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const verificationRecords = pgTable("verification_records", {
  id: serial("id").primaryKey(),
  documentPath: text("document_path").notNull(),
  selfiePath: text("selfie_path").notNull(),
  extractedName: text("extracted_name"),
  extractedAge: integer("extracted_age"),
  extractedDob: text("extracted_dob"),
  faceMatchScore: integer("face_match_score"), // 0-100
  ageVerified: boolean("age_verified").default(false),
  identityVerified: boolean("identity_verified").default(false),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVerificationSchema = createInsertSchema(verificationRecords).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const verificationStepSchema = z.object({
  step: z.enum(["upload", "selfie", "verify", "complete"]),
  recordId: z.number().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type VerificationRecord = typeof verificationRecords.$inferSelect;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;
export type VerificationStep = z.infer<typeof verificationStepSchema>;
