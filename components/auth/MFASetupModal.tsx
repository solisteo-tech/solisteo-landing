'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/lib/api';
import { Loader2, ShieldCheck, Copy, Smartphone } from 'lucide-react';
import Image from 'next/image';

interface MFASetupModalProps {
    onSuccess: () => void;
    trigger?: React.ReactNode;
}

export default function MFASetupModal({ onSuccess, trigger }: MFASetupModalProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<'intro' | 'setup' | 'verify'>('intro');
    const [isLoading, setIsLoading] = useState(false);
    const [secretData, setSecretData] = useState<{ secret: string; qr_code: string; otpauth_url: string } | null>(null);
    const [verifyCode, setVerifyCode] = useState('');
    const { toast } = useToast();

    const startSetup = async () => {
        setIsLoading(true);
        try {
            const res = await authAPI.setupMfa();
            setSecretData(res.data);
            setStep('setup');
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to initialize MFA setup",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const copySecret = () => {
        if (secretData?.secret) {
            navigator.clipboard.writeText(secretData.secret);
            toast({ description: "Secret copied to clipboard" });
        }
    };

    const handleVerify = async () => {
        if (!verifyCode || verifyCode.length !== 6) return;

        setIsLoading(true);
        try {
            await authAPI.enableMfa({
                code: verifyCode,
                secret: secretData!.secret
            });

            toast({
                title: "Success",
                description: "Two-factor authentication enabled successfully",
            });
            setOpen(false);
            onSuccess();
        } catch (error) {
            toast({
                title: "Verification Failed",
                description: "Invalid code. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            // Reset state on close
            setTimeout(() => {
                setStep('intro');
                setSecretData(null);
                setVerifyCode('');
            }, 300);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline">Setup 2FA</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Two-Factor Authentication</DialogTitle>
                    <DialogDescription>
                        Enhance your account security using an authenticator app.
                    </DialogDescription>
                </DialogHeader>

                {step === 'intro' && (
                    <div className="flex flex-col items-center gap-6 py-4 text-center">
                        <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900/20">
                            <Smartphone className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Authenticator apps generate one-time codes that you use to sign in.
                                We support Google Authenticator, Authy, Microsoft Authenticator, and others.
                            </p>
                        </div>
                    </div>
                )}

                {step === 'setup' && secretData && (
                    <div className="space-y-6 py-4">
                        <div className="flex flex-col items-center gap-4">
                            <div className="border p-2 rounded-lg bg-white">
                                {/* Using standard img tag because data URL might be large/incompatible with some optimizations */}
                                <img
                                    src={secretData.qr_code}
                                    alt="QR Code"
                                    className="h-48 w-48 object-contain"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                                Scan this QR code with your authenticator app.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Manual Entry Key</Label>
                            <div className="flex gap-2">
                                <Input readOnly value={secretData.secret} className="font-mono text-xs" />
                                <Button variant="outline" size="icon" onClick={copySecret}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Verification Code</Label>
                            <Input
                                placeholder="000 000"
                                maxLength={6}
                                value={verifyCode}
                                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                                className="text-center text-lg tracking-widest"
                            />
                        </div>
                    </div>
                )}

                <DialogFooter className="sm:justify-between gap-2">
                    {step === 'intro' ? (
                        <Button onClick={startSetup} className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Get Started
                        </Button>
                    ) : (
                        <Button onClick={handleVerify} className="w-full" disabled={isLoading || verifyCode.length !== 6}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify & Enable
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
