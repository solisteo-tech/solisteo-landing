'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Copy, Download } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function TOTPSettings() {
    const [totpStatus, setTotpStatus] = useState<any>(null);
    const [showSetupDialog, setShowSetupDialog] = useState(false);
    const [showDisableDialog, setShowDisableDialog] = useState(false);
    const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
    const [setupData, setSetupData] = useState<any>(null);
    const [verifyCode, setVerifyCode] = useState('');
    const [disableCode, setDisableCode] = useState('');
    const [regenerateCode, setRegenerateCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchTOTPStatus();
    }, []);

    const fetchTOTPStatus = async () => {
        try {
            const response = await api.get('/api/v2/totp/status');
            setTotpStatus(response.data);
        } catch (err) {
            console.error('Failed to fetch TOTP status:', err);
        }
    };

    const handleSetupTOTP = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await api.post('/api/v2/totp/setup');
            setSetupData(response.data);
            setShowSetupDialog(true);
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.response?.data?.detail || 'Failed to setup TOTP',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnableTOTP = async () => {
        try {
            setIsLoading(true);
            setError('');
            await api.post('/api/v2/totp/enable', { code: verifyCode });
            toast({ title: 'Success', description: 'TOTP enabled successfully!' });
            setShowSetupDialog(false);
            setVerifyCode('');
            fetchTOTPStatus();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisableTOTP = async () => {
        try {
            setIsLoading(true);
            setError('');
            await api.post('/api/v2/totp/disable', { code: disableCode });
            toast({ title: 'Success', description: 'TOTP disabled' });
            setShowDisableDialog(false);
            setDisableCode('');
            fetchTOTPStatus();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegenerateBackupCodes = async () => {
        try {
            setIsLoading(true);
            setError('');
            const response = await api.post('/api/v2/totp/regenerate-backup-codes', {
                code: regenerateCode,
            });
            toast({ title: 'Success', description: 'New backup codes generated' });
            setSetupData({ ...setupData, backup_codes: response.data.backup_codes });
            setShowRegenerateDialog(false);
            setRegenerateCode('');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid code');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied!', description: 'Copied to clipboard' });
    };

    const downloadBackupCodes = (codes: string[]) => {
        const text = codes.join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'solisteo-backup-codes.txt';
        a.click();
    };

    return (
        <>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                        Authenticator App (TOTP)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        Use Google Authenticator, Authy, or similar apps for secure login
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {totpStatus?.mfa_enabled ? (
                        <>
                            <Badge
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Enabled
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDisableDialog(true)}
                            >
                                Disable
                            </Button>
                        </>
                    ) : (
                        <Button onClick={handleSetupTOTP} disabled={isLoading}>
                            {isLoading ? 'Setting up...' : 'Enable TOTP'}
                        </Button>
                    )}
                </div>
            </div>

            {totpStatus?.mfa_enabled && (
                <Alert>
                    <AlertDescription className="flex items-center justify-between">
                        <span>
                            Backup codes remaining: {totpStatus.backup_codes_remaining || 0}
                        </span>
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => setShowRegenerateDialog(true)}
                        >
                            Regenerate Codes
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <Alert>
                <AlertDescription>
                    TOTP adds an extra layer of security by requiring a 6-digit code from
                    your authenticator app when logging in.
                </AlertDescription>
            </Alert>

            {/* Setup Dialog */}
            <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
                <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Setup Authenticator App</DialogTitle>
                        <DialogDescription>
                            Scan the QR code with your authenticator app
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {setupData && (
                            <>
                                <div className="flex justify-center p-4 bg-white rounded-lg">
                                    <img
                                        src={setupData.qr_code}
                                        alt="QR Code"
                                        className="w-48 h-48"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Or enter this code manually:</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={setupData.secret}
                                            readOnly
                                            className="font-mono text-sm"
                                        />
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => copyToClipboard(setupData.secret)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Enter 6-digit code from app:</Label>
                                    <Input
                                        placeholder="000000"
                                        value={verifyCode}
                                        onChange={(e) => setVerifyCode(e.target.value)}
                                        maxLength={6}
                                    />
                                    {error && <p className="text-sm text-red-600">{error}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Backup Codes (Save these!):</Label>
                                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded font-mono text-sm space-y-1">
                                        {setupData.backup_codes?.map((code: string, i: number) => (
                                            <div key={i}>{code}</div>
                                        ))}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => downloadBackupCodes(setupData.backup_codes)}
                                    >
                                        <Download className="mr-2 h-4 w-4" /> Download Codes
                                    </Button>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowSetupDialog(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleEnableTOTP}
                                        disabled={isLoading || verifyCode.length !== 6}
                                    >
                                        {isLoading ? 'Verifying...' : 'Enable TOTP'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Disable Dialog */}
            <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Disable TOTP</DialogTitle>
                        <DialogDescription>
                            Enter your TOTP code or backup code to disable
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Verification Code:</Label>
                            <Input
                                placeholder="Enter 6-digit code or backup code"
                                value={disableCode}
                                onChange={(e) => setDisableCode(e.target.value)}
                            />
                            {error && <p className="text-sm text-red-600">{error}</p>}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowDisableDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDisableTOTP}
                                disabled={isLoading || !disableCode}
                            >
                                {isLoading ? 'Disabling...' : 'Disable TOTP'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Regenerate Backup Codes Dialog */}
            <Dialog
                open={showRegenerateDialog}
                onOpenChange={setShowRegenerateDialog}
            >
                <DialogContent className="max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Regenerate Backup Codes</DialogTitle>
                        <DialogDescription>
                            This will invalidate all existing backup codes
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Enter TOTP Code:</Label>
                            <Input
                                placeholder="000000"
                                value={regenerateCode}
                                onChange={(e) => setRegenerateCode(e.target.value)}
                                maxLength={6}
                            />
                            {error && <p className="text-sm text-red-600">{error}</p>}
                        </div>
                        {setupData?.backup_codes && (
                            <div className="space-y-2">
                                <Label>New Backup Codes:</Label>
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded font-mono text-sm space-y-1">
                                    {setupData.backup_codes.map((code: string, i: number) => (
                                        <div key={i}>{code}</div>
                                    ))}
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => downloadBackupCodes(setupData.backup_codes)}
                                >
                                    <Download className="mr-2 h-4 w-4" /> Download Codes
                                </Button>
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowRegenerateDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRegenerateBackupCodes}
                                disabled={isLoading || regenerateCode.length !== 6}
                            >
                                {isLoading ? 'Regenerating...' : 'Regenerate'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
