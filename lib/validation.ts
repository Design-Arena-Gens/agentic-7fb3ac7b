import { z } from "zod";

export const leadSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must have at least 2 characters")
    .max(80, "Name is too long"),
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .min(6, "Phone number must have at least 6 digits")
    .max(20, "Phone number is too long"),
  message: z
    .string()
    .min(5, "Message must have at least 5 characters")
    .max(1024, "Message is too long")
});

export type LeadInput = z.infer<typeof leadSchema>;
