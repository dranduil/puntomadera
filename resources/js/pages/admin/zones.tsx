import { Form, Head } from '@inertiajs/react';
import { AdminCheckbox, AdminField } from '@/components/admin-field';
import { FlashStatus } from '@/components/flash-status';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { centsToInput } from '@/lib/money';
import { index, store, update } from '@/routes/admin/zones';
import type { BreadcrumbItem } from '@/types';

type Zone = {
    id: number;
    name: string;
    neighborhoods: string[] | null;
    travel_fee_cents: number | null;
    visit_fee_cents: number | null;
    is_active: boolean;
    sort_order: number;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Zonas', href: index() }];

function ZoneFields({
    zone,
    prefix,
    errors,
}: {
    zone?: Zone;
    prefix: string;
    errors: Record<string, string>;
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <AdminField
                label="Nombre"
                htmlFor={`${prefix}-name`}
                error={errors.name}
            >
                <Input
                    id={`${prefix}-name`}
                    name="name"
                    required
                    defaultValue={zone?.name}
                />
            </AdminField>
            <AdminField
                label="Orden"
                htmlFor={`${prefix}-sort`}
                error={errors.sort_order}
            >
                <Input
                    id={`${prefix}-sort`}
                    name="sort_order"
                    type="number"
                    min={0}
                    defaultValue={zone?.sort_order ?? 0}
                />
            </AdminField>
            <AdminField
                label="Barrios (separados por coma)"
                htmlFor={`${prefix}-neighborhoods`}
                error={errors.neighborhoods}
                className="md:col-span-2"
            >
                <Textarea
                    id={`${prefix}-neighborhoods`}
                    name="neighborhoods"
                    defaultValue={zone?.neighborhoods?.join(', ') ?? ''}
                />
            </AdminField>
            <AdminField
                label="Movilización ($)"
                htmlFor={`${prefix}-travel`}
                error={errors.travel_fee}
                hint="Vacío = a convenir."
            >
                <Input
                    id={`${prefix}-travel`}
                    name="travel_fee"
                    inputMode="decimal"
                    defaultValue={centsToInput(zone?.travel_fee_cents)}
                />
            </AdminField>
            <AdminField
                label="Visita técnica ($)"
                htmlFor={`${prefix}-visit`}
                error={errors.visit_fee}
                hint="Se descuenta si el cliente contrata."
            >
                <Input
                    id={`${prefix}-visit`}
                    name="visit_fee"
                    inputMode="decimal"
                    defaultValue={centsToInput(zone?.visit_fee_cents)}
                />
            </AdminField>
            <AdminCheckbox
                id={`${prefix}-active`}
                name="is_active"
                label="Activa"
                defaultChecked={zone?.is_active ?? true}
            />
        </div>
    );
}

export default function ZonesAdmin({ zones }: { zones: Zone[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Zonas y movilización" />

            <div className="flex flex-col gap-6 p-4">
                <Heading
                    title="Zonas y movilización"
                    description="Cuánto cobras por llegar a cada zona desde Guasmo. Se suma solo al armar la cotización."
                />

                <FlashStatus />

                {zones.map((zone) => (
                    <Card key={zone.id}>
                        <CardHeader>
                            <CardTitle>{zone.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...update.form.patch(zone.id)}
                                options={{ preserveScroll: true }}
                                className="flex flex-col gap-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <ZoneFields
                                            zone={zone}
                                            prefix={`zone-${zone.id}`}
                                            errors={errors}
                                        />
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-fit"
                                        >
                                            Guardar
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                ))}

                <Card>
                    <CardHeader>
                        <CardTitle>Nueva zona</CardTitle>
                        <CardDescription>
                            Por ejemplo, una ciudad cercana con tarifa fija.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...store.form()}
                            resetOnSuccess
                            className="flex flex-col gap-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <ZoneFields
                                        prefix="new-zone"
                                        errors={errors}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-fit"
                                    >
                                        Crear zona
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
