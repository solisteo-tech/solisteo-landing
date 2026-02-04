/**
 * Force Check Button Component
 * Allows users to manually trigger listing health checks (1 per day)
 */
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useForceCheckStatus, useTriggerForceCheck, useJobStatus } from '@/hooks/useListingHealthData';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export function ForceCheckButton() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [jobId, setJobId] = useState<string | null>(null);

    // Check if user can force check
    const { data: checkStatus, refetch: refetchStatus } = useForceCheckStatus();

    // Trigger force check mutation
    const triggerCheck = useTriggerForceCheck();

    // Poll job status if checking
    const { data: jobStatus } = useJobStatus(jobId, !!jobId);

    // Handle force check click
    const handleForceCheck = async () => {
        try {
            const result = await triggerCheck.mutateAsync();
            setJobId(result.job_id);

            toast({
                title: 'Health Check Started',
                description: result.message,
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.response?.data?.detail || 'Failed to start health check',
                variant: 'destructive',
            });
        }
    };

    // Handle job completion
    useEffect(() => {
        if (jobStatus?.status === 'completed') {
            toast({
                title: 'Health Check Completed',
                description: `Successfully checked ${jobStatus.total_asins} ASINs`,
            });

            // Invalidate listing health data to refresh
            queryClient.invalidateQueries({ queryKey: ['listing-health'] });

            // Reset job ID after a delay
            setTimeout(() => {
                setJobId(null);
                refetchStatus();
            }, 2000);
        } else if (jobStatus?.status === 'failed') {
            toast({
                title: 'Health Check Failed',
                description: 'An error occurred during the health check',
                variant: 'destructive',
            });
            setJobId(null);
        }
    }, [jobStatus?.status, jobStatus?.total_asins, toast, queryClient, refetchStatus]);

    // Determine button state
    const isChecking = jobStatus?.status === 'pending' || jobStatus?.status === 'running';
    const canCheck = checkStatus?.can_check && !isChecking;
    const progress = jobStatus?.progress || 0;

    return (
        <div className="flex items-center gap-3">
            <Button
                onClick={handleForceCheck}
                disabled={!canCheck || triggerCheck.isPending}
                size="sm"
                className="relative"
            >
                {isChecking ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Checking... {progress}%
                    </>
                ) : jobStatus?.status === 'completed' ? (
                    <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                    </>
                ) : (
                    <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Force Check {!canCheck && '(Used Today)'}
                    </>
                )}
            </Button>

            {!canCheck && checkStatus?.last_check_date && (
                <span className="text-xs text-gray-500">
                    Last check: {new Date(checkStatus.last_check_date).toLocaleDateString()}
                </span>
            )}
        </div>
    );
}
