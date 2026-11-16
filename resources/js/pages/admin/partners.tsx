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
import { formatCents } from '@/lib/money';
import { index, store, update } from '@/routes/admin/partners';
import type { BreadcrumbItem } from '@/types';

type Partner = {
    id: number;
    name: string;
    trade: string;
    phone: string | null;
    commission_percent: number;
    notes: string | null;
    is_active: boolean;
};

type Commission = {
    partner_id: number;
    partner: string;
    quotes: number;
    sales_cents: number;
    commission_cents: number;
};

type Referral = {
    id: number;
    reference: string;
    client: string;
    partner: string | null;
    date: string;
};

type Props = {
    partners: Partner[];
    commissions: Commission[];
    referrals: Referral[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Aliados', href: index() }];

function PartnerFields({
    partner,
    prefix,
    errors,
}: {
    partner?: Partner;
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
                    defaultValue={partner?.name}
                />
            </AdminField>
            <AdminField
                label="Oficio"
                htmlFor={`${prefix}-trade`}
                error={errors.trade}
            >
                <Input
                    id={`${prefix}-trade`}
                    name="trade"
                    required
                    placeholder="Marmolería, vidrio y aluminio…"
                    defaultValue={partner?.trade}
                />
            </AdminField>
            <AdminField
                label="Teléfono"
                htmlFor={`${prefix}-phone`}
                error={errors.phone}
            >
                <Input
                    id={`${prefix}-phone`}
                    name="phone"
                    defaultValue={partner?.phone ?? ''}
                />
            </AdminField>
            <AdminField
                label="Comisión (%)"
                htmlFor={`${prefix}-commission`}
                error={errors.commission_percent}
            >
                <Input
                    id={`${prefix}-commission`}
                    name="commission_percent"
                    inputMode="decimal"
                    required
                    defaultValue={partner?.commission_percent ?? 10}
                />
            </AdminField>
            <AdminField
                label="Notas"
                htmlFor={`${prefix}-notes`}
                error={errors.notes}
                className="md:col-span-2"
            >
                <Textarea
                    id={`${prefix}-notes`}
                    name="notes"
                    defaultValue={partner?.notes ?? ''}
                />
            </AdminField>
            <AdminCheckbox
                id={`${prefix}-active`}
                name="is_active"
                label="Activo"
                defaultChecked={partner?.is_active ?? true}
            />
        </div>
    );
}

export default function PartnersAdmin({
    partners,
    commissions,
    referrals,
}: Props) {
    const totalOwed = commissions.reduce(
        (sum, row) => sum + row.commission_cents,
        0,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Aliados y comisiones" />

            <div className="flex flex-col gap-6 p-4">
                <Heading
                    title="Aliados y comisiones"
                    description="Marmolerías, vidrierías y maestros de confianza. Ganas una comisión por cada trabajo que les pasas."
                />

                <FlashStatus />

                <Card>
                    <CardHeader>
                        <CardTitle>Comisiones por cobrar</CardTitle>
                        <CardDescription>
                            De cotizaciones aceptadas o pagadas que incluyen
                            trabajos de aliados. Total:{' '}
                            <strong>{formatCents(totalOwed)}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 text-sm">
                        {commissions.length === 0 && (
                            <p className="text-muted-foreground">
                                Todavía no hay comisiones.
                            </p>
                        )}
                        {commissions.map((row) => (
                            <div
                                key={row.partner_id}
                                className="flex flex-wrap justify-between gap-2 border-b pb-2"
                            >
                                <span className="font-medium">
                                    {row.partner}
                                </span>
                                <span className="text-muted-foreground">
                                    {row.quotes} cotizaciones · ventas{' '}
                                    {formatCents(row.sales_cents)} · comisión{' '}
                                    <strong className="text-foreground">
                                        {formatCents(row.commission_cents)}
                                    </strong>
                                </span>
                            </div>
                        ))}
                        {referrals.length > 0 && (
                            <>
                                <div className="mt-4 font-medium">
                                    Solicitudes derivadas
                                </div>
                                {referrals.map((referral) => (
                                    <div
                                        key={referral.id}
                                        className="flex flex-wrap justify-between gap-2 text-muted-foreground"
                                    >
                                        <span>
                                            {referral.reference} ·{' '}
                                            {referral.client}
                                        </span>
                                        <span>
                                            {referral.partner ?? '—'} ·{' '}
                                            {referral.date}
                                        </span>
                                    </div>
                                ))}
                            </>
                        )}
                    </CardContent>
                </Card>

                {partners.map((partner) => (
                    <Card key={partner.id}>
                        <CardHeader>
                            <CardTitle>{partner.name}</CardTitle>
                            <CardDescription>{partner.trade}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...update.form.patch(partner.id)}
                                options={{ preserveScroll: true }}
                                className="flex flex-col gap-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <PartnerFields
                                            partner={partner}
                                            prefix={`partner-${partner.id}`}
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
                        <CardTitle>Nuevo aliado</CardTitle>
                        <CardDescription>
                            Después asígnalo a ítems del catálogo (por ejemplo,
                            mesón de cuarzo) para calcular su comisión.
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
                                    <PartnerFields
                                        prefix="new-partner"
                                        errors={errors}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-fit"
                                    >
                                        Crear aliado
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
