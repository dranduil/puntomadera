import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Props = {
    label: string;
    htmlFor: string;
    error?: string;
    hint?: string;
    className?: string;
    children: ReactNode;
};

/** Label + control + validation message, the layout every admin form uses. */
export function AdminField({
    label,
    htmlFor,
    error,
    hint,
    className,
    children,
}: Props) {
    return (
        <div className={cn('grid gap-2', className)}>
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            <InputError message={error} />
        </div>
    );
}

/** Checkbox that always submits 0 or 1, so unchecked boxes are saved too. */
export function AdminCheckbox({
    id,
    name,
    label,
    defaultChecked,
}: {
    id: string;
    name: string;
    label: string;
    defaultChecked?: boolean;
}) {
    return (
        <div className="flex items-center gap-2">
            <input name={name} type="hidden" value="0" />
            <input
                id={id}
                name={name}
                type="checkbox"
                value="1"
                defaultChecked={defaultChecked}
                className="size-4 accent-primary"
            />
            <Label htmlFor={id}>{label}</Label>
        </div>
    );
}
