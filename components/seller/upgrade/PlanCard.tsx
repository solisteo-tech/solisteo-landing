
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Zap, Check, Star, ArrowRight } from 'lucide-react';
import { SubscriptionPlan } from '@/lib/types/subscription';

interface PlanCardProps {
    plan: SubscriptionPlan;
    isCurrentPlan: boolean;
    onSelect: (plan: SubscriptionPlan) => void;
    isLoading?: boolean;
}

interface PlanFeature {
    name: string;
    included: boolean;
    limit?: number | string;
}

export function PlanCard({ plan, isCurrentPlan, onSelect, isLoading }: PlanCardProps) {
    const getTierConfig = (tier: string) => {
        switch (tier) {
            case 'premium':
                return {
                    icon: <Crown className="h-6 w-6 text-yellow-500" />,
                    color: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
                    accentColor: 'text-yellow-700',
                    buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
                };
            case 'priority':
                return {
                    icon: <Shield className="h-6 w-6 text-blue-500" />,
                    color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
                    accentColor: 'text-blue-700',
                    buttonColor: 'bg-blue-600 hover:bg-blue-700'
                };
            default:
                return {
                    icon: <Zap className="h-6 w-6 text-gray-500" />,
                    color: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200',
                    accentColor: 'text-gray-700',
                    buttonColor: 'bg-gray-600 hover:bg-gray-700'
                };
        }
    };

    const config = getTierConfig(plan.support_tier);

    const features: PlanFeature[] = [
        { name: 'Custom Charts', included: true, limit: plan.max_charts === -1 ? 'Unlimited' : plan.max_charts },
        { name: 'Alert Configurations', included: true, limit: plan.max_alerts === -1 ? 'Unlimited' : plan.max_alerts },
        { name: 'Data Sources', included: true, limit: plan.max_data_sources === -1 ? 'Unlimited' : plan.max_data_sources },
        { name: 'API Calls', included: true, limit: plan.api_calls_limit === -1 || !plan.api_calls_limit ? 'Unlimited' : `${plan.api_calls_limit.toLocaleString()}/month` },
        { name: 'Custom Exports', included: plan.has_custom_exports },
        { name: 'Priority Support', included: plan.support_tier === 'priority' || plan.support_tier === 'premium' },
        { name: 'Premium Support', included: plan.support_tier === 'premium' },
        { name: 'Advanced Analytics', included: plan.support_tier === 'premium' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            <Card className={`relative h-full flex flex-col ${config.color} ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}>
                {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white px-3 py-1 hover:bg-blue-600">
                            <Star className="h-3 w-3 mr-1" />
                            Current Plan
                        </Badge>
                    </div>
                )}

                <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-2">
                        {config.icon}
                    </div>
                    <CardTitle className={`text-xl ${config.accentColor}`}>{plan.name}</CardTitle>
                    <CardDescription className="text-2xl font-bold text-gray-900">
                        ${plan.price_monthly}/month
                    </CardDescription>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">{feature.name}</span>
                                <div className="flex items-center gap-2">
                                    {feature.limit && <span className="text-xs text-gray-500">{feature.limit}</span>}
                                    {feature.included ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button
                        className={`w-full mt-4 ${config.buttonColor} ${isCurrentPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !isCurrentPlan && onSelect(plan)}
                        disabled={isCurrentPlan || isLoading}
                    >
                        {isLoading && !isCurrentPlan ? (
                            'Processing...'
                        ) : isCurrentPlan ? (
                            'Current Plan'
                        ) : (
                            <>
                                Upgrade to {plan.name}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
