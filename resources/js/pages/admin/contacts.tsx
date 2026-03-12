import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/routes/admin/contacts';
import type { BreadcrumbItem } from '@/types';

type Contact = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    subject: string | null;
    message: string;
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
    contacts: Paginator<Contact>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contacts',
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

export default function ContactsAdmin({ contacts }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Contacts" />

            <div className="space-y-6">
                <Heading
                    title="Contacts"
                    description="Manage contact messages from the landing page."
                />

                <div className="grid gap-4">
                    {contacts.data.length === 0 ? (
                        <Card className="p-6 text-sm text-muted-foreground">
                            No messages yet.
                        </Card>
                    ) : (
                        contacts.data.map((contact) => (
                            <Card key={contact.id} className="p-6">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className="font-semibold">
                                                {contact.name}
                                            </div>
                                            <StatusBadge
                                                status={contact.status}
                                            />
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {contact.phone
                                                ? `${contact.phone} · `
                                                : ''}
                                            {contact.email ?? 'No email'}
                                        </div>
                                        {contact.subject && (
                                            <div className="text-sm">
                                                <span className="font-medium">
                                                    Subject:
                                                </span>{' '}
                                                {contact.subject}
                                            </div>
                                        )}
                                        <div className="mt-3 rounded-md border border-border/60 bg-muted/20 p-3 text-sm">
                                            {contact.message}
                                        </div>
                                    </div>

                                    <div className="w-full md:max-w-sm">
                                        <Form
                                            {...update.form.patch(contact.id)}
                                            className="space-y-4"
                                        >
                                            {({ processing, errors }) => (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`status-${contact.id}`}
                                                        >
                                                            Status
                                                        </Label>
                                                        <select
                                                            id={`status-${contact.id}`}
                                                            name="status"
                                                            defaultValue={
                                                                contact.status
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
                                                            htmlFor={`admin_notes-${contact.id}`}
                                                        >
                                                            Notes
                                                        </Label>
                                                        <Input
                                                            id={`admin_notes-${contact.id}`}
                                                            name="admin_notes"
                                                            defaultValue={
                                                                contact.admin_notes ??
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

                {contacts.links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {contacts.links.map((link) => (
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
