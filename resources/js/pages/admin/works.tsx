import { Form, Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { destroy, index, store, update } from '@/routes/admin/works';
import type { BreadcrumbItem } from '@/types';

type Work = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    worked_on: string | null;
    location: string | null;
    images: string[] | null;
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
    works: Paginator<Work>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Works',
        href: index(),
    },
];

export default function WorksAdmin({ works }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Works" />

            <div className="space-y-6">
                <Heading
                    title="Trabajos"
                    description="Create and manage your portfolio gallery."
                />

                <Card className="p-6">
                    <div className="text-sm font-semibold">New work</div>
                    <Separator className="my-5" />

                    <Form {...store.form()} className="grid gap-4 md:grid-cols-2">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="new_title">Title</Label>
                                    <Input
                                        id="new_title"
                                        name="title"
                                        required
                                        placeholder="Example: Closet a medida"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="new_slug">Slug (optional)</Label>
                                    <Input
                                        id="new_slug"
                                        name="slug"
                                        placeholder="closet-a-medida"
                                    />
                                    <InputError message={errors.slug} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="new_worked_on">
                                        Date (optional)
                                    </Label>
                                    <Input
                                        id="new_worked_on"
                                        name="worked_on"
                                        type="date"
                                    />
                                    <InputError message={errors.worked_on} />
                                </div>

                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="new_location">
                                        Location (optional)
                                    </Label>
                                    <Input
                                        id="new_location"
                                        name="location"
                                        placeholder="Guayaquil"
                                    />
                                    <InputError message={errors.location} />
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
                                    <Label htmlFor="new_images">
                                        Image URLs (one per line)
                                    </Label>
                                    <textarea
                                        id="new_images"
                                        name="images"
                                        className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        placeholder="https://...\nhttps://..."
                                    />
                                    <InputError message={errors.images} />
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
                    {works.data.map((work) => (
                        <Card key={work.id} className="p-6">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                    <div className="font-semibold">
                                        {work.title}
                                    </div>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        /trabajos · {work.slug}
                                    </div>
                                    {(work.location || work.worked_on) && (
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            {[work.location, work.worked_on]
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </div>
                                    )}
                                    {work.images && work.images.length > 0 && (
                                        <div className="mt-4 grid grid-cols-6 gap-2">
                                            {work.images
                                                .slice(0, 6)
                                                .map((url) => (
                                                    <div
                                                        key={url}
                                                        className="aspect-square overflow-hidden rounded-md bg-muted"
                                                    >
                                                        <img
                                                            src={url}
                                                            alt={work.title}
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>

                                <div className="w-full lg:max-w-md">
                                    <Form
                                        {...update.form.patch(work.id)}
                                        className="space-y-4"
                                    >
                                        {({ processing, errors }) => (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor={`title-${work.id}`}
                                                    >
                                                        Title
                                                    </Label>
                                                    <Input
                                                        id={`title-${work.id}`}
                                                        name="title"
                                                        defaultValue={work.title}
                                                    />
                                                    <InputError
                                                        message={errors.title}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor={`slug-${work.id}`}
                                                    >
                                                        Slug
                                                    </Label>
                                                    <Input
                                                        id={`slug-${work.id}`}
                                                        name="slug"
                                                        defaultValue={work.slug}
                                                    />
                                                    <InputError
                                                        message={errors.slug}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor={`worked_on-${work.id}`}
                                                    >
                                                        Date
                                                    </Label>
                                                    <Input
                                                        id={`worked_on-${work.id}`}
                                                        name="worked_on"
                                                        type="date"
                                                        defaultValue={
                                                            work.worked_on ?? ''
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.worked_on}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor={`location-${work.id}`}
                                                    >
                                                        Location
                                                    </Label>
                                                    <Input
                                                        id={`location-${work.id}`}
                                                        name="location"
                                                        defaultValue={
                                                            work.location ?? ''
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.location}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor={`description-${work.id}`}
                                                    >
                                                        Description
                                                    </Label>
                                                    <textarea
                                                        id={`description-${work.id}`}
                                                        name="description"
                                                        defaultValue={
                                                            work.description ?? ''
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
                                                        htmlFor={`images-${work.id}`}
                                                    >
                                                        Image URLs
                                                    </Label>
                                                    <textarea
                                                        id={`images-${work.id}`}
                                                        name="images"
                                                        defaultValue={
                                                            work.images?.join(
                                                                '\n',
                                                            ) ?? ''
                                                        }
                                                        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                    />
                                                    <InputError
                                                        message={errors.images}
                                                    />
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <input
                                                        name="is_published"
                                                        type="hidden"
                                                        value="0"
                                                    />
                                                    <input
                                                        id={`is_published-${work.id}`}
                                                        name="is_published"
                                                        type="checkbox"
                                                        defaultChecked={
                                                            work.is_published
                                                        }
                                                        value="1"
                                                    />
                                                    <Label
                                                        htmlFor={`is_published-${work.id}`}
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
                                                                work.id,
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
