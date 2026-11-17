import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { buildWhatsAppHref } from '@/lib/whatsapp';

/**
 * Same footer as resources/views/components/public-footer.blade.php. The link
 * groups come from App\Support\SiteLinks through the shared `site` prop, so
 * Blade and Inertia pages never drift apart. Links are plain anchors because
 * some targets are Blade pages that Inertia cannot visit.
 */
export function PublicFooter() {
    const { site } = usePage().props;
    const whatsappHref = buildWhatsAppHref(
        site.whatsappNumber,
        'Hola, quiero información sobre un trabajo de carpintería.',
    );

    return (
        <footer className="border-t border-border/60 bg-card">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                    <div>
                        <a
                            href="/"
                            className="flex items-center gap-3 text-primary"
                            aria-label="punto madera, inicio"
                        >
                            <AppLogoIcon
                                className="size-11 shrink-0"
                                aria-hidden="true"
                            />
                            <span>
                                <span className="block text-sm font-light tracking-[0.38em] lowercase">
                                    punto madera
                                </span>
                                <span className="mt-1 block text-[0.58rem] tracking-[0.32em] text-muted-foreground uppercase">
                                    Guayaquil, Ecuador
                                </span>
                            </span>
                        </a>
                        <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                            Muebles a medida, closets, cocinas, puertas y
                            reparaciones en Guayaquil. Cotización clara antes de
                            empezar.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <Button asChild>
                                <a href="/cotizar">Pedir cotización</a>
                            </Button>
                            <Button asChild variant="outline">
                                <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    WhatsApp
                                </a>
                            </Button>
                        </div>
                    </div>

                    <nav
                        aria-label="Páginas del sitio"
                        className="grid grid-cols-2 gap-8 sm:grid-cols-4"
                    >
                        {site.footer.map((group) => (
                            <div key={group.title}>
                                <p className="text-sm font-semibold text-foreground">
                                    {group.title}
                                </p>
                                <ul className="mt-4 grid gap-2 text-sm">
                                    {group.links.map((link) => (
                                        <li key={link.href}>
                                            <a
                                                href={link.href}
                                                className="text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {new Date().getFullYear()} punto madera · Guayaquil,
                        Ecuador
                    </p>
                    {site.contactPhone && (
                        <a
                            href={`tel:${site.contactPhone.replace(/[^0-9+]/g, '')}`}
                            className="transition-colors hover:text-foreground"
                        >
                            {site.contactPhone}
                        </a>
                    )}
                </div>
            </div>
        </footer>
    );
}
