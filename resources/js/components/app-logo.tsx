import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const appName = import.meta.env.VITE_APP_NAME || 'punto madera';

    return (
        <>
            <AppLogoIcon
                className="size-8 shrink-0 text-sidebar-primary"
                aria-hidden="true"
            />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-light tracking-[0.22em] lowercase">
                    {appName.replace('-', ' ')}
                </span>
            </div>
        </>
    );
}
