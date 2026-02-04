
import { useState } from "react";
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { ownerApi } from "@/lib/adminApi";
import { CreateUserSchema, CreateUserFormValues } from "@/lib/validators/team";
import { useToast } from "@/hooks/use-toast"; // Ensure this path is correct based on your project

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateUserDialog({ open, onOpenChange, onSuccess }: CreateUserDialogProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CreateUserFormValues>({
        resolver: zodResolver(CreateUserSchema),
        defaultValues: {
            full_name: "",
            email: "",
            password: "",
            role: "viewer",
        },
    });

    const onSubmit = async (data: CreateUserFormValues) => {
        setIsLoading(true);
        try {
            await ownerApi.createUser(data);
            toast({
                title: "User Created",
                description: `${data.full_name} has been added to the team.`,
            });
            form.reset();
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Failed to create user",
                description: error.response?.data?.detail || "An error occurred.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                    <DialogDescription>
                        Invite a new employee to your company dashboard.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@company.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Initial Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <FormLabel>Role</FormLabel>
                            <Input value="Viewer (Read-Only)" disabled />
                            <FormDescription>
                                All team members have read-only access to company data.
                            </FormDescription>
                        </div>

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
                                {isLoading ? "Creating..." : "Create User"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
