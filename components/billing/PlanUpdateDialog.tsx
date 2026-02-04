/**
 * Plan Update Dialog Component
 * Confirmation dialog for changing subscription plans
 */

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SellerBilling, SubscriptionPlan } from '@/types/billing';
import { formatCurrency } from '@/lib/billing-utils';
import { useState } from 'react';

interface PlanUpdateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    seller: SellerBilling | null;
    plans: SubscriptionPlan[];
    onConfirm: (sellerId: string, planId: string) => Promise<void>;
}

export function PlanUpdateDialog({
    open,
    onOpenChange,
    seller,
    plans,
    onConfirm,
}: PlanUpdateDialogProps) {
    const [selectedPlanId, setSelectedPlanId] = useState<string>('');
    const [isUpdating, setIsUpdating] = useState(false);

    const selectedPlan = plans.find(p => p.id === selectedPlanId);

    const handleConfirm = async () => {
        if (!seller || !selectedPlanId) return;

        setIsUpdating(true);
        try {
            await onConfirm(seller.id, selectedPlanId);
            onOpenChange(false);
            setSelectedPlanId('');
        } catch (error) {
            // Error is handled by the parent component
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Change Subscription Plan</AlertDialogTitle>
                    <AlertDialogDescription>
                        Update the subscription plan for <strong>{seller?.name}</strong>.
                        This change will take effect immediately.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Current Plan</label>
                        <div className="text-sm text-muted-foreground">
                            {seller?.current_plan} - {formatCurrency(seller?.plan_price || 0)}/month
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">New Plan</label>
                        <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                            <SelectContent>
                                {plans.map((plan) => (
                                    <SelectItem key={plan.id} value={plan.id}>
                                        {plan.name} - {formatCurrency(plan.price_monthly)}/month
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedPlan && (
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-medium">Plan Details</h4>
                            <ul className="text-sm space-y-1">
                                {selectedPlan.features?.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <span className="text-green-600">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={!selectedPlanId || isUpdating}
                    >
                        {isUpdating ? 'Updating...' : 'Confirm Change'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
