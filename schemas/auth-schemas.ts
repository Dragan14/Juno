import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(64, "Name cannot exceed 64 characters")
  .regex(
    /^[A-Za-z\s\-']+$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes",
  )
  .refine((name) => name.trim() === name, {
    message: "Name cannot have leading or trailing spaces",
  })
  .refine((name) => !name.includes("  "), {
    message: "Name cannot contain consecutive spaces",
  });
