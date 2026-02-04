'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming basic checkbox or I'll use input type='checkbox'
import { SubscriptionPlan } from '@/lib/types/subscription';
import { useEffect } from 'react';

// Define the schema
const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    price_monthly: z.coerce.number().min(0, 'Price must be positive'),
    price_yearly: z.coerce.number().min(0, 'Price must be positive'),
    max_users: z.coerce.number().int().min(-1, 'Use -1 for unlimited'),
    max_charts: z.coerce.number().int().min(-1),
    max_alerts: z.coerce.number().int().min(-1),
    max_data_sources: z.coerce.number().int().min(-1),
    features: z.array(z.string()),
});

export type SubscriptionPlanFormData = z.infer<typeof formSchema>;

interface SubscriptionPlanFormProps {
    initialData?: SubscriptionPlan;
    onSubmit: (data: SubscriptionPlanFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export const AVAILABLE_FEATURES = [
    { id: 'sales', label: 'Sales Analytics', description: 'Access to sales data and analytics' },
    { id: 'inventory', label: 'Inventory Management', description: 'Inventory tracking and management' },
    { id: 'sales_inventory', label: 'Business Intelligence', description: 'Unified sales and inventory analytics dashboard' },
    { id: 'listing_health', label: 'Listing Health', description: 'Amazon product listing health checker' },
    { id: 'advertisement_analytics', label: 'Ads Hub', description: 'Amazon advertising campaign analytics and insights' },
    { id: 'market_research', label: 'Market Research', description: 'Competitor analysis, niche finder, and trend tracking' },
    { id: 'custom_dashboard', label: 'Custom Dashboard', description: 'Drag-and-drop widgets and personalized reports' },
    { id: 'reports', label: 'Advanced Reports', description: 'Custom reports and exports' },
    { id: 'api', label: 'API Access', description: 'API access for integrations' },
    { id: 'alerts', label: 'Advanced Alerts', description: 'Custom alert configurations' },
    { id: 'multi_user', label: 'Multi-User Access', description: 'Multiple user accounts' },
    { id: 'whatsapp', label: 'Priority WhatsApp Support', description: 'Direct WhatsApp contact for priority support' },
    { id: 'segmentation', label: 'Advanced Filtering & Segmentation', description: 'Deep data slicing and custom segmentation (Beta)' },
];

export function SubscriptionPlanForm({ initialData, onSubmit, onCancel, isLoading }: SubscriptionPlanFormProps) {
    const form = useForm<SubscriptionPlanFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            price_monthly: 0,
            price_yearly: 0,
            max_users: 5,
            max_charts: 5,
            max_alerts: 3,
            max_data_sources: 2,
            features: [],
            ...initialData,
        },
    });

    // Reset form when initialData changes (for editing)
    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                price_monthly: initialData.price_monthly,
                price_yearly: initialData.price_yearly,
                max_users: initialData.max_users,
                max_charts: initialData.max_charts || 5, // fallback
                max_alerts: initialData.max_alerts || 3, // fallback
                max_data_sources: initialData.max_data_sources,
                features: initialData.features || [],
            });
        } else {
            form.reset({
                name: '',
                price_monthly: 0,
                price_yearly: 0,
                max_users: 5,
                max_charts: 5,
                max_alerts: 3,
                max_data_sources: 2,
                features: [],
            });
        }
    }, [initialData, form]);

    const handleSubmit = async (data: SubscriptionPlanFormData) => {
        await onSubmit(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Plan Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Pro Plan" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="max_users"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Max Users (-1 for unlimited)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="price_monthly"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Monthly Price (₹)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price_yearly"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Yearly Price (₹)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-3">
                    <FormLabel className="text-base">Limits</FormLabel>
                    <div className="grid gap-4 md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="max_data_sources"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Data Sources</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="max_charts"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Charts</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="max_alerts"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Alerts</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <FormLabel className="text-base">Features</FormLabel>
                    <div className="grid gap-3 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="features"
                            render={() => (
                                <FormItem className="col-span-2 grid md:grid-cols-2 gap-3 space-y-0">
                                    {AVAILABLE_FEATURES.map((feature) => (
                                        <FormField
                                            key={feature.id}
                                            control={form.control}
                                            name="features"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={feature.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(feature.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, feature.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== feature.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel className="font-medium cursor-pointer">
                                                                {feature.label}
                                                            </FormLabel>
                                                            <FormDescription>
                                                                {feature.description}
                                                            </FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="outline" type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {initialData ? 'Update Plan' : 'Create Plan'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
