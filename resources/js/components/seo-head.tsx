import { Head } from '@inertiajs/react';

export type Seo = {
    title: string;
    description: string;
    canonical?: string;
    robots?: string;
    image?: string;
    jsonLd?: Record<string, unknown>;
};

/** Title, description, robots, canonical and social tags for a public page. */
export function SeoHead({ seo }: { seo: Seo }) {
    return (
        <Head title={seo.title}>
            <meta
                head-key="description"
                name="description"
                content={seo.description}
            />
            <meta
                head-key="robots"
                name="robots"
                content={seo.robots ?? 'index,follow,max-image-preview:large'}
            />
            {seo.canonical && (
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={seo.canonical}
                />
            )}
            <meta head-key="og:title" property="og:title" content={seo.title} />
            <meta
                head-key="og:description"
                property="og:description"
                content={seo.description}
            />
            {seo.canonical && (
                <meta
                    head-key="og:url"
                    property="og:url"
                    content={seo.canonical}
                />
            )}
            <meta head-key="og:type" property="og:type" content="website" />
            <meta head-key="og:locale" property="og:locale" content="es_EC" />
            <meta
                head-key="og:site_name"
                property="og:site_name"
                content="Punto Madera"
            />
            {seo.image && (
                <meta
                    head-key="og:image"
                    property="og:image"
                    content={seo.image}
                />
            )}
            <meta
                head-key="twitter:card"
                name="twitter:card"
                content={seo.image ? 'summary_large_image' : 'summary'}
            />
            <meta
                head-key="twitter:title"
                name="twitter:title"
                content={seo.title}
            />
            <meta
                head-key="twitter:description"
                name="twitter:description"
                content={seo.description}
            />
            {seo.jsonLd && (
                <script head-key="schema" type="application/ld+json">
                    {JSON.stringify(seo.jsonLd)}
                </script>
            )}
        </Head>
    );
}
