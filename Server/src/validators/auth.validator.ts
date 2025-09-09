import { z } from "zod"

export const emailSchema = z.string().trim().email("Invalid email address").min(1).max(255)

export const passwordSchema = z.string()
   .trim()
   .min(8)
   .max(12)
   .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
   .regex(/[a-z]/, "Password must contain at least one lowercase letter")
   .regex(/[0-9]/, "Password must contain at least one number")
   .regex(/[\W_]/, "Password must contain at least one special character")

export const registerSchema = z.object({
   name: z.string().trim().min(1, "Name is required").max(100, "Name must be at most 100 characters long"),
   email: emailSchema,
   password: passwordSchema
})

export const loginSchema = z.object({
   email: emailSchema,
   password: passwordSchema
})

export type registerSchemaType = z.infer<typeof registerSchema>
export type loginSchemaType = z.infer<typeof loginSchema>