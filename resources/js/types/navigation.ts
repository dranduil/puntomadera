import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type FooterGroup = {
    title: string;
    links: { label: string; href: string }[];
};

/** Shared `site` prop from App\Support\SiteLinks::shared(). */
export type SiteInfo = {
    footer: FooterGroup[];
    whatsappNumber: string;
    contactPhone: string | null;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
};
