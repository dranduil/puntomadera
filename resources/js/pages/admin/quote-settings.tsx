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
import { edit, update } from '@/routes/admin/quote-settings';
import type { BreadcrumbItem } from '@/types';

type Settings = {
    quote_terms: string;
    validity_days: number;
    deposit_percent: number;
    iva_enabled: boolean;
    deuna_payment_link: string | null;
    deuna_qr_url: string | null;
    bank_transfer_details: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ajustes de cotización', href: edit() },
];

export default function QuoteSettingsAdmin({
    settings,
}: {
    settings: Settings;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajustes de cotización" />

            <div className="flex flex-col gap-6 p-4">
                <Heading
                    title="Ajustes de cotización"
                    description="Valores que se llenan solos en cada cotización nueva. Puedes cambiarlos en cada una."
                />

                <FlashStatus />

                <Form
                    {...update.form()}
                    options={{ preserveScroll: true }}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Condiciones</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-3">
                                    <AdminField
                                        label="Aviso y condiciones (lo ve el cliente)"
                                        htmlFor="quote_terms"
                                        error={errors.quote_terms}
                                        className="md:col-span-3"
                                    >
                                        <Textarea
                                            id="quote_terms"
                                            name="quote_terms"
                                            className="min-h-32"
                                            defaultValue={settings.quote_terms}
                                        />
                                    </AdminField>
                                    <AdminField
                                        label="Validez (días)"
                                        htmlFor="quote_validity_days"
                                        error={errors.quote_validity_days}
                                    >
                                        <Input
                                            id="quote_validity_days"
                                            name="quote_validity_days"
                                            type="number"
                                            min={1}
                                            max={180}
                                            defaultValue={
                                                settings.validity_days
                                            }
                                        />
                                    </AdminField>
                                    <AdminField
                                        label="Anticipo (%)"
                                        htmlFor="deposit_percent"
                                        error={errors.deposit_percent}
                                    >
                                        <Input
                                            id="deposit_percent"
                                            name="deposit_percent"
                                            type="number"
                                            min={0}
                                            max={100}
                                            defaultValue={
                                                settings.deposit_percent
                                            }
                                        />
                                    </AdminField>
                                    <div className="flex items-end pb-2">
                                        <AdminCheckbox
                                            id="iva_enabled"
                                            name="iva_enabled"
                                            label="Cobrar IVA 15% por defecto"
                                            defaultChecked={
                                                settings.iva_enabled
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Cómo te pagan</CardTitle>
                                    <CardDescription>
                                        El cliente ve estas opciones después de
                                        aceptar la cotización.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <AdminField
                                        label="Link de cobro Deuna"
                                        htmlFor="deuna_payment_link"
                                        error={errors.deuna_payment_link}
                                        hint="Créalo en la app Deuna Negocios y pégalo aquí."
                                        className="md:col-span-2"
                                    >
                                        <Input
                                            id="deuna_payment_link"
                                            name="deuna_payment_link"
                                            type="url"
                                            placeholder="https://"
                                            defaultValue={
                                                settings.deuna_payment_link ??
                                                ''
                                            }
                                        />
                                    </AdminField>
                                    <AdminField
                                        label="Código QR de Deuna (imagen)"
                                        htmlFor="deuna_qr"
                                        error={errors.deuna_qr}
                                    >
                                        <Input
                                            id="deuna_qr"
                                            name="deuna_qr"
                                            type="file"
                                            accept="image/*"
                                        />
                                    </AdminField>
                                    {settings.deuna_qr_url && (
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={settings.deuna_qr_url}
                                                alt="QR de Deuna actual"
                                                className="size-24 rounded-md border object-contain"
                                            />
                                            <AdminCheckbox
                                                id="remove_deuna_qr"
                                                name="remove_deuna_qr"
                                                label="Quitar QR"
                                            />
                                        </div>
                                    )}
                                    <AdminField
                                        label="Datos para transferencia"
                                        htmlFor="bank_transfer_details"
                                        error={errors.bank_transfer_details}
                                        hint="Banco, tipo y número de cuenta, nombre y cédula/RUC."
                                        className="md:col-span-2"
                                    >
                                        <Textarea
                                            id="bank_transfer_details"
                                            name="bank_transfer_details"
                                            defaultValue={
                                                settings.bank_transfer_details ??
                                                ''
                                            }
                                        />
                                    </AdminField>
                                </CardContent>
                            </Card>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-fit"
                            >
                                Guardar ajustes
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
