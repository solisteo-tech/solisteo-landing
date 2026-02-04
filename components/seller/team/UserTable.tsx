
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Key, ShieldOff, Trash2 } from "lucide-react";
import { User } from "@/lib/adminApi";

interface UserTableProps {
    users: User[];
    loggedInUserId?: string;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onResetPassword: (user: User) => void;
    onResetMFA: (user: User) => void;
}

export function UserTable({
    users,
    loggedInUserId,
    onEdit,
    onDelete,
    onResetPassword,
    onResetMFA,
}: UserTableProps) {
    return (
        <div className="border rounded-lg shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>MFA</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                No team members found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((u) => (
                            <TableRow key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                    {u.full_name}
                                </TableCell>
                                <TableCell className="text-gray-500 dark:text-gray-400">
                                    {u.email} {u.id === loggedInUserId && "(You)"}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`font-medium ${u.role === "owner"
                                                ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                                                : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                                            }`}
                                    >
                                        <span className="capitalize">{u.role}</span>
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={u.is_active ? "default" : "secondary"}
                                        className={
                                            u.is_active
                                                ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                        }
                                    >
                                        {u.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            u.mfa_enabled
                                                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                                : "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800/50 dark:text-gray-500 dark:border-gray-700"
                                        }
                                    >
                                        {u.mfa_enabled ? "Enabled" : "Disabled"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {u.role !== "owner" && u.id !== loggedInUserId && (
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(u)}
                                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                title="Edit User"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onResetPassword(u)}
                                                className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
                                                title="Reset Password"
                                            >
                                                <Key className="h-4 w-4" />
                                            </Button>
                                            {u.mfa_enabled && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onResetMFA(u)}
                                                    className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                                                    title="Disable MFA"
                                                >
                                                    <ShieldOff className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(u)}
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                title="Delete User"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
