import { z } from "zod";

export const SupportTicketSchema = z.object({
    subject: z.string().min(5, "Subject must be at least 5 characters").max(100),
    category: z.enum(["general", "technical", "billing", "account"], {
        required_error: "Please select a category",
    }),
    priority: z.enum(["low", "medium", "high"], {
        required_error: "Please select a priority",
    }),
    description: z.string().min(20, "Please provide more detail (min 20 chars)"),
});

export type SupportTicketValues = z.infer<typeof SupportTicketSchema>;

export interface Ticket {
    id: string;
    subject: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'closed' | 'pending';
    createdAt: string;
}
