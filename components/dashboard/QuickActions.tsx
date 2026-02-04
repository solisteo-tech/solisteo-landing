import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, UserPlus, Bell, FileText, Server } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuickActions() {
    const router = useRouter();

    const actions = [
        { label: 'Add Company', icon: UserPlus, href: '/admin/companies', color: 'text-blue-500' },
        { label: 'View Alerts', icon: Bell, href: '/admin/alerts', color: 'text-orange-500' },
        { label: 'Audit Logs', icon: FileText, href: '/admin/logs', color: 'text-purple-500' },
        { label: 'Settings', icon: Server, href: '/admin/settings', color: 'text-slate-500' },
    ];

    return (
        <Card className="border-2 border-dashed bg-muted/50">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {actions.map((action) => (
                        <Button
                            key={action.label}
                            variant="outline"
                            className="h-auto py-4 flex-col gap-2 hover:bg-background hover:border-primary/50 transition-all group"
                            onClick={() => router.push(action.href)}
                        >
                            <action.icon className={`h-6 w-6 ${action.color} group-hover:scale-110 transition-transform`} />
                            <span className="text-sm font-medium">{action.label}</span>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
