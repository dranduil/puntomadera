import { Form, Head } from '@inertiajs/react';
import { Star } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { index, update } from '@/routes/admin/reviews';
import type { BreadcrumbItem } from '@/types';

type Review = {
    id: number;
    name: string;
    location: string | null;
    rating: number;
    message: string;
    photos: string[];
    status: string;
    admin_notes: string | null;
    created_at: string | null;
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
    reviews: Paginator<Review>;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reviews',
        href: index(),
    },
];

function StatusBadge({ status }: { status: string }) {
    return (
        <Badge
            variant={
                status === 'approved'
                    ? 'secondary'
                    : status === 'rejected'
                      ? 'destructive'
                      : 'outline'
            }
        >
            {status}
        </Badge>
    );
}

function RatingStars({ rating }: { rating: number }) {
    return (
        <div
            className="flex items-center gap-0.5 text-primary"
            aria-label={`${rating} de 5 estrellas`}
        >
            {[1, 2, 3, 4, 5].map((value) => (
                <Star
                    key={value}
                    className="size-4"
                    fill={value <= rating ? 'currentColor' : 'none'}
                    aria-hidden="true"
                />
            ))}
        </div>
    );
}

export default function ReviewsAdmin({ reviews }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Reviews" />

            <div className="space-y-6">
                <Heading
                    title="Customer reviews"
                    description="Moderate customer reviews before they appear publicly."
                />

                {reviews.data.length === 0 ? (
                    <Card className="p-6 text-sm text-muted-foreground">
                        No reviews yet.
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {reviews.data.map((review) => (
                            <Card key={review.id} className="p-6">
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0 space-y-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="font-semibold">
                                                {review.name}
                                            </div>
                                            <StatusBadge
                                                status={review.status}
                                            />
                                            <RatingStars
                                                rating={review.rating}
                                            />
                                        </div>
                                        {review.location && (
                                            <div className="text-sm text-muted-foreground">
                                                {review.location}
                                            </div>
                                        )}
                                        <div className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm leading-6 whitespace-pre-wrap">
                                            {review.message}
                                        </div>
                                        {review.photos.length > 0 && (
                                            <div className="grid max-w-xl grid-cols-3 gap-2">
                                                {review.photos.map((photo) => (
                                                    <img
                                                        key={photo}
                                                        src={photo}
                                                        alt={`Review photo from ${review.name}`}
                                                        className="aspect-square w-full rounded-md object-cover"
                                                        loading="lazy"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full lg:max-w-sm">
                                        <Form
                                            {...update.form.patch(review.id)}
                                            className="space-y-4"
                                        >
                                            {({ processing, errors }) => (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`status-${review.id}`}
                                                        >
                                                            Status
                                                        </Label>
                                                        <select
                                                            id={`status-${review.id}`}
                                                            name="status"
                                                            defaultValue={
                                                                review.status
                                                            }
                                                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                        >
                                                            <option value="pending">
                                                                pending
                                                            </option>
                                                            <option value="approved">
                                                                approved
                                                            </option>
                                                            <option value="rejected">
                                                                rejected
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
                                                            htmlFor={`admin_notes-${review.id}`}
                                                        >
                                                            Internal notes
                                                        </Label>
                                                        <Input
                                                            id={`admin_notes-${review.id}`}
                                                            name="admin_notes"
                                                            defaultValue={
                                                                review.admin_notes ??
                                                                ''
                                                            }
                                                            placeholder="Optional moderation note"
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
                                                        Save review
                                                    </Button>
                                                </>
                                            )}
                                        </Form>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {reviews.links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {reviews.links.map((link) => (
                            <Button
                                key={link.label}
                                variant={link.active ? 'default' : 'outline'}
                                disabled={!link.url}
                                asChild={Boolean(link.url)}
                            >
                                {link.url ? (
                                    <a
                                        href={link.url}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
