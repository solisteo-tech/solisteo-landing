'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { SupportTicketSchema, SupportTicketValues, Ticket } from '@/lib/validators/support';

interface ContactFormProps {
    onSubmitSuccess: (ticket: Ticket) => void;
}

export default function ContactForm({ onSubmitSuccess }: ContactFormProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<SupportTicketValues>({
        resolver: zodResolver(SupportTicketSchema),
        defaultValues: {
            subject: '',
            description: '',
            category: 'general',
            priority: 'medium',
        },
    });

    const onSubmit = async (data: SupportTicketValues) => {
        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newTicket: Ticket = {
                id: `TKT-${Math.floor(Math.random() * 10000)}`,
                subject: data.subject,
                category: data.category,
                priority: data.priority,
                status: 'open',
                createdAt: new Date().toISOString(),
            };

            onSubmitSuccess(newTicket);
            form.reset();
            toast({ title: 'Ticket Submitted', description: 'Your support request has been received.' });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to submit ticket', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">

                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                                <Input placeholder="Brief summary of your issue" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="general">General Inquiry</SelectItem>
                                        <SelectItem value="technical">Technical Issue</SelectItem>
                                        <SelectItem value="billing">Billing & Payments</SelectItem>
                                        <SelectItem value="account">Account Support</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="low">Low - General Question</SelectItem>
                                        <SelectItem value="medium">Medium - Standard Issue</SelectItem>
                                        <SelectItem value="high">High - Urgent Business Impact</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Please provide details about the issue..."
                                    className="min-h-[120px] resize-y"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Include steps to reproduce if applicable.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" /> Submit Request
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
