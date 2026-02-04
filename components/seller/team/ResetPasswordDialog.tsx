
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { ownerApi, User } from "@/lib/adminApi";
import { ResetPasswordSchema, ResetPasswordFormValues } from "@/lib/validators/team";
import { useToast } from "@/hooks/use-toast";

interface ResetPasswordDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ResetPasswordDialog({ user, open, onOpenChange, onSuccess }: ResetPasswordDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            new_password: "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({ new_password: "" });
        }
    }, [open, form]);

    const onSubmit = async (data: ResetPasswordFormValues) => {
        if (!user) return;
        setIsLoading(true);
        try {
            await ownerApi.resetUserPassword(user.id, data.new_password);
            toast({
                title: "Password Reset",
                description: `New password set for ${user.full_name}.`,
            });
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Reset Failed",
                description: error.response?.data?.detail || "Could not reset password.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                        Set a new temporary password for {user?.email}.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="new_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter new password" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The user will be able to log in immediately with this password.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="pt-4 flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} variant="destructive">
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
