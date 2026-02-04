
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Subscription } from "@/lib/adminApi";

interface PlanUsageCardProps {
    subscription: Subscription | null;
}

export function PlanUsageCard({ subscription }: PlanUsageCardProps) {
    if (!subscription) return null;

    const usagePercent =
        subscription.max_users > 0
            ? (subscription.current_users / subscription.max_users) * 100
            : 100;

    return (
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm h-fit">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 py-4">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Plan Usage
                </CardTitle>
                <CardDescription className="text-xs">
                    User limits based on your plan
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between border border-blue-100 dark:border-blue-800">
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Current Plan
                    </span>
                    <Badge className="capitalize bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:border-blue-700">
                        {subscription.subscription_plan}
                    </Badge>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">User Seats</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {subscription.current_users} / {subscription.max_users}
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${usagePercent >= 100 ? 'bg-red-500' : 'bg-blue-600'
                                }`}
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 text-right">
                        {subscription.users_remaining} seats remaining
                    </p>
                </div>

                {subscription.users_remaining <= 0 && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>
                            User limit reached. Please upgrade your plan to add more members.
                        </AlertDescription>
                    </Alert>
                )}

                <Button
                    variant="outline"
                    className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-900/30"
                    onClick={() => {
                        // Placeholder: In a real app, this would redirect to /billing or open a contact form
                        // native 'alert' is blocked by lint rules in some setups, using console or just nothing is better, 
                        // but we can't easily access toast here without passing it or using the hook.
                        // Since this is a component, let's just make it a non-op visual or redirect to a hash.
                        window.location.href = "mailto:solisteo.tech@gmail.com?subject=Upgrade Plan Request";
                    }}
                >
                    Upgrade Plan
                </Button>
            </CardContent>
        </Card>
    );
}
