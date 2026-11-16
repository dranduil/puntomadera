type TrackingWindow = Window & {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
};

/** Sends a lead conversion to GA4 and the Meta Pixel when they are loaded. */
export function trackLead(form: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    const tracker = window as TrackingWindow;

    tracker.gtag?.('event', 'generate_lead', {
        form,
        page_path: window.location.pathname,
    });
    tracker.fbq?.('track', 'Lead', { content_name: form });
}
