import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/shadcn/alert-dialog";
import React, { ReactNode, useState } from "react";

interface ConfirmDialogProps {
    trigger: ReactNode;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => Promise<void> | void;
    onCancel?: () => void;
    confirmButtonClassName?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    trigger,
    title,
    description,
    confirmText = "확인",
    cancelText = "취소",
    onConfirm,
    onCancel,
    confirmButtonClassName = "bg-red-600 text-white hover:bg-red-700",
}: ConfirmDialogProps) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!onConfirm) return;
        try {
            setLoading(true);
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={loading}
                        className={confirmButtonClassName}
                    >
                        {loading ? "처리 중..." : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ConfirmDialog;