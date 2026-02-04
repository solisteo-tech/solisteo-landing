
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TeamHeaderProps {
    canAdd: boolean;
    onAddClick: () => void;
}

export function TeamHeader({ canAdd, onAddClick }: TeamHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    Team Management
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Manage your company employees and access levels
                </p>
            </div>

            <Button
                className="bg-primary hover:bg-primary/90 text-white"
                disabled={!canAdd}
                onClick={onAddClick}
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Team Member
            </Button>
        </div>
    );
}
