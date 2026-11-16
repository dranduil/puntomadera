import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/admin/ai-history';
import type { BreadcrumbItem } from '@/types';

type Log = {
    id: number;
    tool: string;
    summary: string;
    arguments: Record<string, unknown> | null;
    created_at: string;
};

type Props = {
    logs: {
        data: Log[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    enabled: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Historial IA', href: index() },
];

export default function AiHistory({ logs, enabled }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historial IA" />

            <div className="flex flex-col gap-6 p-4">
                <Heading
                    title="Historial IA"
                    description="Cada cambio que hizo el asistente de IA (precios, ajustes, estados, borradores). Nada se borra."
                />

                <div className="flex items-center gap-2 text-sm">
                    <Badge variant={enabled ? 'default' : 'outline'}>
                        {enabled ? 'Conexión IA activa' : 'Conexión IA apagada'}
                    </Badge>
                    {!enabled && (
                        <span className="text-muted-foreground">
                            Se activa con MCP_TOKEN en el servidor.
                        </span>
                    )}
                </div>

                {logs.data.length === 0 && (
                    <Card className="p-6 text-sm text-muted-foreground">
                        Todavía no hay cambios hechos por la IA.
                    </Card>
                )}

                <div className="grid gap-3">
                    {logs.data.map((log) => (
                        <Card key={log.id} className="grid gap-2 p-4">
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                <Badge variant="secondary">{log.tool}</Badge>
                                <span className="text-muted-foreground">
                                    {log.created_at}
                                </span>
                            </div>
                            <p className="text-sm">{log.summary}</p>
                            {log.arguments && (
                                <details className="text-xs text-muted-foreground">
                                    <summary className="cursor-pointer">
                                        Datos enviados
                                    </summary>
                                    <pre className="mt-2 overflow-x-auto rounded-md bg-muted/50 p-3">
                                        {JSON.stringify(log.arguments, null, 2)}
                                    </pre>
                                </details>
                            )}
                        </Card>
                    ))}
                </div>

                {logs.links.length > 3 && (
                    <div className="flex flex-wrap gap-2">
                        {logs.links.map((link) => (
                            <Button
                                key={link.label}
                                asChild
                                size="sm"
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
