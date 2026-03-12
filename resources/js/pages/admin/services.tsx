import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { destroy, index, store, update } from '@/routes/admin/services';
import type { BreadcrumbItem } from '@/types';

type Service = {
    id: number;
    name: string;
    slug: string;
    summary: string | null;
    description: string | null;
    process_steps: string[] | null;
    default_message: string | null;
    is_published: boolean;
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
    services: Paginator<Service>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Services',
        href: index(),
    },
];

export default function ServicesAdmin({ services }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Services" />

            <div className="space-y-6">
                <Heading
                    title="Services"
                    description="Create and manage services and their process flow."
                />

                <Card className="p-6">
                    <div className="text-sm font-semibold">New service</div>
                    <Separator className="my-5" />

                    <Form {...store.form()} className="grid gap-4 md:grid-cols-2">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="new_name">Name</Label>
                                    <Input
                                        id="new_name"
                                        name="name"
                                        required
                                        placeholder="Example: Closets empotrados"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="new_slug">Slug (optional)</Label>
                                    <Input
                                        id="new_slug"
                                        name="slug"
                                        placeholder="closets-empotrados"
                                    />
                                    <InputError message={errors.slug} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="new_summary">Summary</Label>
                                    <Input
                                        id="new_summary"
                                        name="summary"
                                        placeholder="Short line for cards"
                                    />
                                    <InputError message={errors.summary} />
                                </div>

                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="new_description">
                                        Description (optional)
                                    </Label>
                                    <textarea
                                        id="new_description"
                                        name="description"
                                        className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="new_process_steps">
                                        Process steps (one per line)
                                    </Label>
                                    <textarea
                                        id="new_process_steps"
                                        name="process_steps"
                                        className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        placeholder="1) Medidas\n2) Diseño\n3) Fabricación\n4) Instalación"
                                    />
                                    <InputError
                                        message={errors.process_steps}
                                    />
                                </div>

                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="new_default_message">
                                        Default message (optional)
                                    </Label>
                                    <textarea
                                        id="new_default_message"
                                        name="default_message"
                                        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        placeholder="Hola, quiero cotizar este servicio..."
                                    />
                                    <InputError
                                        message={errors.default_message}
                                    />
                                </div>

                                <div className="flex items-center gap-2 md:col-span-2">
                                    <input
                                        name="is_published"
                                        type="hidden"
                                        value="0"
                                    />
                                    <input
                                        id="new_is_published"
                                        name="is_published"
                                        type="checkbox"
                                        defaultChecked
                                        value="1"
                                    />
                                    <Label htmlFor="new_is_published">
                                        Published
                                    </Label>
                                </div>

                                <div className="flex justify-end md:col-span-2">
                                    <Button type="submit" disabled={processing}>
                                        Create
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </Card>

                <div className="grid gap-4">
                    {services.data.map((service) => (
                        <Card key={service.id} className="p-6">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                    <div className="font-semibold">
                                        {service.name}
                                    </div>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        /servicios/{service.slug}
                                    </div>
                                    {service.summary && (
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            {service.summary}
                                        </div>
                                    )}
                                </div>

                                <div className="w-full lg:max-w-md">
                                    <Form
                                        {...update.form.patch(service.id)}
                                        className="space-y-4"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor={`name-${service.id}`}
                                                    >
                                                        Name
                                                    </Label>
                                                    <Input
                                                        id={`name-${service.id}`}
                                                        name="name"
                                                        defaultValue={service.name}
                                                    />
                                                    <InputError
                                                        message={errors.name}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor={`slug-${service.id}`}
                                                    >
                                                        Slug
                                                    </Label>
                                                    <Input
                                                        id={`slug-${service.id}`}
                                                        name="slug"
                                                        defaultValue={service.slug}
                                                    />
                                                    <InputError
                                                        message={errors.slug}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor={`summary-${service.id}`}
                                                    >
                                                        Summary
                                                    </Label>
                                                    <Input
                                                        id={`summary-${service.id}`}
                                                        name="summary"
                                                        defaultValue={
                                                            service.summary ?? ''
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.summary}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor={`description-${service.id}`}
                                                    >
                                                        Description
                                                    </Label>
                                                    <textarea
                                                        id={`description-${service.id}`}
                                                        name="description"
                                                        defaultValue={
                                                            service.description ?? ''
                                                        }
                                                        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.description
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor={`process_steps-${service.id}`}
                                                    >
                                                        Process steps
                                                    </Label>
                                                    <textarea
                                                        id={`process_steps-${service.id}`}
                                                        name="process_steps"
                                                        defaultValue={
                                                            service.process_steps?.join(
                                                                '\n',
                                                            ) ?? ''
                                                        }
                                                        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.process_steps
                                                        }
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor={`default_message-${service.id}`}
                                                    >
                                                        Default message
                                                    </Label>
                                                    <textarea
                                                        id={`default_message-${service.id}`}
                                                        name="default_message"
                                                        defaultValue={
                                                            service.default_message ??
                                                            ''
                                                        }
                                                        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.default_message
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <input
                                                        name="is_published"
                                                        type="hidden"
                                                        value="0"
                                                    />
                                                    <input
                                                        id={`is_published-${service.id}`}
                                                        name="is_published"
                                                        type="checkbox"
                                                        defaultChecked={
                                                            service.is_published
                                                        }
                                                        value="1"
                                                    />
                                                    <Label
                                                        htmlFor={`is_published-${service.id}`}
                                                    >
                                                        Published
                                                    </Label>
                                                </div>

                                                <div className="flex items-center justify-between gap-3">
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        Save
                                                    </Button>

                                                    <Button
                                                        asChild
                                                        variant="destructive"
                                                    >
                                                        <Link
                                                            href={destroy(
                                                                service.id,
                                                            )}
                                                            method="delete"
                                                            as="button"
                                                        >
                                                            Delete
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </Form>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

