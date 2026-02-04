
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
import { Switch } from "@/components/ui/switch";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { ownerApi, User } from "@/lib/adminApi";
import { EditUserSchema, EditUserFormValues } from "@/lib/validators/team";
import { useToast } from "@/hooks/use-toast";

interface EditUserDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditUserDialog({ user, open, onOpenChange, onSuccess }: EditUserDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<EditUserFormValues>({
        resolver: zodResolver(EditUserSchema),
        defaultValues: {
            full_name: "",
            is_active: true,
        },
    });

    useEffect(() => {
        if (user && open) {
            form.reset({
                full_name: user.full_name,
                is_active: user.is_active,
            });
        }
    }, [user, open, form]);

    const onSubmit = async (data: EditUserFormValues) => {
        if (!user) return;
        setIsLoading(true);
        try {
            await ownerApi.updateUser(user.id, data);
            toast({
                title: "User Updated",
                description: "Team member details saved successfully.",
            });
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: error.response?.data?.detail || "Could not update user.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Team Member</DialogTitle>
                    <DialogDescription>
                        Update details for {user?.email}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <FormLabel>Email</FormLabel>
                            <Input value={user?.email || ""} disabled />
                            <FormDescription>Email address cannot be changed</FormDescription>
                        </div>

                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Account Active</FormLabel>
                                        <FormDescription>
                                            Disable to prevent login access
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
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
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
