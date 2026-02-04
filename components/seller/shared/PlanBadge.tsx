import { Crown, Shield, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SubscriptionPlan } from '@/lib/types/subscription';

interface PlanBadgeProps {
    plan: SubscriptionPlan;
    className?: string; // Allow overrides
}

export const PlanBadge = ({ plan, className }: PlanBadgeProps) => {
    // Logic extracted to a map prevents "if/else" spaghetti
    const getTheme = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('enterprise') || n.includes('premium')) return 'warning';
        if (n.includes('growth') || n.includes('pro') || n.includes('priority')) return 'info';
        return 'default';
    };

    const theme = getTheme(plan.name);

    const styles = {
        warning: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
        info: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
        default: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
    };

    const Icon = theme === 'warning' ? Crown : theme === 'info' ? Shield : Zap;

    return (
        <Badge className={`${styles[theme]} flex items-center gap-1 px-3 py-1 ${className || ''}`}>
            <Icon className="h-3.5 w-3.5" />
            {plan.name}
        </Badge>
    );
};
