import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, Menu } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { buildWhatsAppHref } from '@/lib/whatsapp';

type Props = {
    whatsappHref?: string;
};

/**
 * Same header as resources/views/components/public-header.blade.php. The menu
 * comes from App\Support\SiteLinks through the shared `site` prop.
 */
export function PublicHeader({ whatsappHref }: Props) {
    const { site } = usePage().props;
    const appName = import.meta.env.VITE_APP_NAME || 'punto madera';
    const defaultWhatsappHref =
        whatsappHref ??
        buildWhatsAppHref(
            site.whatsappNumber,
            'Hola, quiero cotizar con Punto Madera.',
        );

    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
            <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="flex shrink-0 items-center gap-3 text-primary"
                    aria-label="punto madera"
                >
                    <AppLogoIcon
                        className="size-11 text-primary"
                        aria-hidden="true"
                    />
                    <span className="hidden leading-none sm:block">
                        <span className="block text-sm font-light tracking-[0.38em] lowercase">
                            {appName.replace('-', ' ')}
                        </span>
                        <span className="mt-1 block text-[0.58rem] tracking-[0.32em] text-muted-foreground uppercase">
                            Guayaquil, Ecuador
                        </span>
                    </span>
                </Link>

                <nav
                    aria-label="Navegación principal"
                    className="hidden items-center gap-7 text-sm font-medium lg:flex"
                >
                    {site.header.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-muted-foreground transition-colors hover:text-primary"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label="Abrir menú"
                                >
                                    <Menu aria-hidden="true" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <SheetTitle className="sr-only">
                                    Navegación
                                </SheetTitle>
                                <SheetHeader className="text-left">
                                    <div className="flex items-center gap-3">
                                        <AppLogoIcon
                                            className="size-9 text-primary"
                                            aria-hidden="true"
                                        />
                                        <div>
                                            <div className="font-light tracking-[0.32em] text-primary lowercase">
                                                {appName.replace('-', ' ')}
                                            </div>
                                            <div className="mt-1 text-xs tracking-[0.22em] text-muted-foreground uppercase">
                                                Guayaquil, Ecuador
                                            </div>
                                        </div>
                                    </div>
                                </SheetHeader>
                                <nav
                                    aria-label="Navegación móvil"
                                    className="mt-4 grid gap-1 px-4"
                                >
                                    {site.header.map((item) => (
                                        <Button
                                            key={item.href}
                                            asChild
                                            variant="ghost"
                                            className="justify-start text-base"
                                        >
                                            <Link href={item.href}>
                                                {item.label}
                                            </Link>
                                        </Button>
                                    ))}
                                    <Button asChild className="mt-4">
                                        <Link href="/cotizar">
                                            Pedir cotización
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <a
                                            href={defaultWhatsappHref}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Escribir por WhatsApp
                                            <ArrowUpRight data-icon="inline-end" />
                                        </a>
                                    </Button>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Button asChild className="hidden sm:inline-flex">
                        <Link href="/cotizar">Pedir cotización</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
