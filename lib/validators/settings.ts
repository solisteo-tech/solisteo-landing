import { z } from 'zod';

export const IntegrationConfigSchema = z.object({
    enabled: z.boolean().default(false),
    sellerId: z.string().optional(),
    marketplace: z.string().optional(),
    domain: z.string().optional().refine(val => !val || val.includes('.'), {
        message: "Invalid domain (e.g., store.myshopify.com)"
    }),
    accountId: z.string().optional(),
});

export const OrgSettingsSchema = z.object({
    timezone: z.string().optional(),
    supportEmail: z.string().optional(),
    businessHours: z.string().optional(),
});

export const SettingsSchema = z.object({
    integrations: z.object({
        amazon: IntegrationConfigSchema,
        flipkart: IntegrationConfigSchema,
        shopify: IntegrationConfigSchema,
        stripe: IntegrationConfigSchema,
    }),
    org: OrgSettingsSchema.optional(),
});

export type SettingsFormValues = z.infer<typeof SettingsSchema>;

export const DEFAULT_SETTINGS: SettingsFormValues = {
    integrations: {
        amazon: { enabled: false, sellerId: '', marketplace: 'IN' },
        flipkart: { enabled: false, sellerId: '' },
        shopify: { enabled: false, domain: '' },
        stripe: { enabled: false, accountId: '' },
    },
    org: {
        timezone: 'Asia/Kolkata',
        supportEmail: '',
        businessHours: '9:00-18:00'
    }
};
