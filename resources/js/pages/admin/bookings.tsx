import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/routes/admin/bookings';
import type { BreadcrumbItem } from '@/types';

type Booking = {
    id: number;
    name: string;
    email: string | null;
    phone: string;
    service: string;
    preferred_date: string | null;
    preferred_time: string | null;
    message: string | null;
    status: string;
    admin_notes: string | null;
    created_at: string;
};

type Paginator<T> = {
    data: T[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

type Props = {
    bookings: Paginator<Booking>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bookings',
        href: index(),
    },
];

function StatusBadge({ status }: { status: string }) {
    const variant =
        status === 'done'
            ? 'secondary'
            : status === 'in_progress'
              ? 'default'
              : status === 'cancelled'
                ? 'destructive'
                : 'outline';

    return <Badge variant={variant}>{status}</Badge>;
}

export default function BookingsAdmin({ bookings }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Bookings" />

            <div className="space-y-6">
                <Heading
                    title="Bookings"
                    description="Manage booking requests from the landing page."
                />

                <div className="grid gap-4">
                    {bookings.data.length === 0 ? (
                        <Card className="p-6 text-sm text-muted-foreground">
                            No bookings yet.
                        </Card>
                    ) : (
                        bookings.data.map((booking) => (
                            <Card key={booking.id} className="p-6">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className="font-semibold">
                                                {booking.name}
                                            </div>
                                            <StatusBadge
                                                status={booking.status}
                                            />
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {booking.phone}
                                            {booking.email
                                                ? ` · ${booking.email}`
                                                : ''}
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-medium">
                                                Service:
                                            </span>{' '}
                                            {booking.service}
                                        </div>
                                        {(booking.preferred_date ||
                                            booking.preferred_time) && (
                                            <div className="text-sm text-muted-foreground">
                                                Preferred:{' '}
                                                {booking.preferred_date ?? '-'}{' '}
                                                {booking.preferred_time ?? ''}
                                            </div>
                                        )}
                                        {booking.message && (
                                            <div className="mt-3 rounded-md border border-border/60 bg-muted/20 p-3 text-sm">
                                                {booking.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full md:max-w-sm">
                                        <Form
                                            {...update.form.patch(booking.id)}
                                            className="space-y-4"
                                        >
                                            {({ processing, errors }) => (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`status-${booking.id}`}
                                                        >
                                                            Status
                                                        </Label>
                                                        <select
                                                            id={`status-${booking.id}`}
                                                            name="status"
                                                            defaultValue={
                                                                booking.status
                                                            }
                                                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                        >
                                                            <option value="new">
                                                                new
                                                            </option>
                                                            <option value="in_progress">
                                                                in_progress
                                                            </option>
                                                            <option value="done">
                                                                done
                                                            </option>
                                                            <option value="cancelled">
                                                                cancelled
                                                            </option>
                                                        </select>
                                                        <InputError
                                                            message={
                                                                errors.status
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`admin_notes-${booking.id}`}
                                                        >
                                                            Notes
                                                        </Label>
                                                        <Input
                                                            id={`admin_notes-${booking.id}`}
                                                            name="admin_notes"
                                                            defaultValue={
                                                                booking.admin_notes ??
                                                                ''
                                                            }
                                                            placeholder="Internal notes..."
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.admin_notes
                                                            }
                                                        />
                                                    </div>

                                                    <Button
                                                        type="submit"
                                                        className="w-full"
                                                        disabled={processing}
                                                    >
                                                        Save
                                                    </Button>
                                                </>
                                            )}
                                        </Form>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {bookings.links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {bookings.links.map((link) => (
                            <Button
                                key={link.label}
                                asChild
                                variant={link.active ? 'default' : 'outline'}
                                disabled={!link.url}
                            >
                                <Link href={link.url ?? index()}>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </Link>
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
