export default function AppLogo() {
    const appName = import.meta.env.VITE_APP_NAME || 'punto madera';

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-[0.56rem] font-semibold tracking-[0.12em] text-sidebar-primary">
                PM
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-light tracking-[0.22em] lowercase">
                    {appName.replace('-', ' ')}
                </span>
            </div>
        </>
    );
}
