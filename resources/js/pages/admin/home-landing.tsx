import { Form, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { edit, update } from '@/routes/admin/home';
import type { BreadcrumbItem } from '@/types';

type Landing = {
    hero_title: string | null;
    hero_subtitle: string | null;
    seo_title: string | null;
    seo_description: string | null;
    whatsapp_number: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    areas_served: string[] | null;
};

type Props = {
    landing: Landing | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: edit(),
    },
];

export default function HomeLandingAdmin({ landing }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Home landing" />

            <div className="space-y-6">
                <Heading
                    title="Home landing page"
                    description="Edit SEO, WhatsApp, and contact information."
                />

                <Card className="p-6">
                    <Form {...update.form()} className="space-y-6">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="seo_title">SEO title</Label>
                                    <Input
                                        id="seo_title"
                                        name="seo_title"
                                        defaultValue={landing?.seo_title ?? ''}
                                        placeholder="Carpintero en Guayaquil | Muebles a medida, closets y puertas"
                                    />
                                    <InputError message={errors.seo_title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="seo_description">
                                        SEO description
                                    </Label>
                                    <textarea
                                        id="seo_description"
                                        name="seo_description"
                                        defaultValue={
                                            landing?.seo_description ?? ''
                                        }
                                        className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        placeholder="Carpintería a domicilio en Guayaquil..."
                                    />
                                    <InputError
                                        message={errors.seo_description}
                                    />
                                </div>

                                <Separator />

                                <div className="grid gap-2">
                                    <Label htmlFor="hero_title">
                                        Hero title
                                    </Label>
                                    <Input
                                        id="hero_title"
                                        name="hero_title"
                                        defaultValue={landing?.hero_title ?? ''}
                                        placeholder="Carpintero en Guayaquil para muebles a medida, closets y puertas"
                                    />
                                    <InputError message={errors.hero_title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="hero_subtitle">
                                        Hero subtitle
                                    </Label>
                                    <textarea
                                        id="hero_subtitle"
                                        name="hero_subtitle"
                                        defaultValue={
                                            landing?.hero_subtitle ?? ''
                                        }
                                        className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        placeholder="Describe your service in a few lines..."
                                    />
                                    <InputError
                                        message={errors.hero_subtitle}
                                    />
                                </div>

                                <Separator />

                                <div className="grid gap-2">
                                    <Label htmlFor="whatsapp_number">
                                        WhatsApp number
                                    </Label>
                                    <Input
                                        id="whatsapp_number"
                                        name="whatsapp_number"
                                        defaultValue={
                                            landing?.whatsapp_number ?? ''
                                        }
                                        placeholder="5939XXXXXXXX"
                                    />
                                    <InputError
                                        message={errors.whatsapp_number}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="contact_email">
                                            Contact email
                                        </Label>
                                        <Input
                                            id="contact_email"
                                            name="contact_email"
                                            type="email"
                                            defaultValue={
                                                landing?.contact_email ?? ''
                                            }
                                            placeholder="contacto@tu-dominio.com"
                                        />
                                        <InputError
                                            message={errors.contact_email}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="contact_phone">
                                            Contact phone
                                        </Label>
                                        <Input
                                            id="contact_phone"
                                            name="contact_phone"
                                            defaultValue={
                                                landing?.contact_phone ?? ''
                                            }
                                            placeholder="+593 ..."
                                        />
                                        <InputError
                                            message={errors.contact_phone}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="areas_served">
                                        Areas served (comma-separated)
                                    </Label>
                                    <Input
                                        id="areas_served"
                                        name="areas_served"
                                        defaultValue={
                                            landing?.areas_served?.join(', ') ??
                                            ''
                                        }
                                        placeholder="Guayaquil, Samborondón, Daule"
                                    />
                                    <InputError message={errors.areas_served} />
                                </div>

                                <div className="flex items-center justify-end">
                                    <Button type="submit" disabled={processing}>
                                        Save changes
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </Card>
            </div>
        </AppLayout>
    );
}
