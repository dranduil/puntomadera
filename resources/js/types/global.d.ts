import type { Auth } from '@/types/auth';
import type { SiteInfo } from '@/types/navigation';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            site: SiteInfo;
            flash?: { status?: string | null };
            [key: string]: unknown;
        };
    }
}
