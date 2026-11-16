import { usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function FlashStatus() {
    const status = usePage().props.flash?.status;

    if (!status) {
        return null;
    }

    return (
        <Alert>
            <CheckCircle2 />
            <AlertDescription>{status}</AlertDescription>
        </Alert>
    );
}
