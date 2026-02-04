
import { z } from "zod";

export const CreateUserSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.literal("viewer").default("viewer"),
});

export const EditUserSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    is_active: z.boolean(),
});

export const ResetPasswordSchema = z.object({
    new_password: z.string().min(8, "Password must be at least 8 characters"),
});

export type CreateUserFormValues = z.infer<typeof CreateUserSchema>;
export type EditUserFormValues = z.infer<typeof EditUserSchema>;
export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;
