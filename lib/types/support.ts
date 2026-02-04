export interface Message {
    id: string;
    ticket_id: string;
    sender_id: string;
    sender_role: string;
    message: string;
    attachments?: Array<{ filename: string; url: string; size: number; type: string }>;
    is_read: boolean;
    is_internal: boolean;
    created_at: string;
    read_at?: string;
}

export interface Ticket {
    id: string;
    subject: string;
    category: string;
    status: string;
    priority: string;
    created_at: string;
    updated_at: string;
    unread_count?: number;
    last_message?: Message;
    creator?: {
        id: string;
        email: string;
        full_name: string;
        company_name: string;
    };
}

export interface SellerProfile {
    id: string;
    email: string;
    full_name: string;
    company_name: string;
}
