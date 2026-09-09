import { Form, Head } from '@inertiajs/react';
import { Camera, CheckCircle2, Star } from 'lucide-react';
import InputError from '@/components/input-error';
import { PublicHeader } from '@/components/public-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { store } from '@/routes/reviews';

type Landing = {
    whatsapp_number: string | null;
};

type Review = {
    id: number;
    name: string;
    location: string | null;
    rating: number;
    message: string;
    photos: string[];
    published_at: string | null;
};

type Seo = {
    title: string;
    description: string;
    canonical: string;
    jsonLd: Record<string, unknown>;
};

type Props = {
    landing: Landing;
    reviews: Review[];
    captcha: {
        question: string;
    };
    reviewStatus: string | null;
    seo: Seo;
};

function RatingStars({ rating }: { rating: number }) {
    return (
        <div
            className="flex items-center gap-0.5 text-primary"
            aria-label={`${rating} de 5 estrellas`}
        >
            {[1, 2, 3, 4, 5].map((value) => (
                <Star
                    key={value}
                    className="size-4"
                    fill={value <= rating ? 'currentColor' : 'none'}
                    aria-hidden="true"
                />
            ))}
        </div>
    );
}

export default function ReviewsPage({
    landing,
    reviews,
    captcha,
    reviewStatus,
    seo,
}: Props) {
    return (
        <>
            <Head title={seo.title}>
                <meta
                    head-key="description"
                    name="description"
                    content={seo.description}
                />
                <meta
                    head-key="robots"
                    name="robots"
                    content="index,follow,max-image-preview:large"
                />
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={seo.canonical}
                />
                <meta
                    head-key="og:title"
                    property="og:title"
                    content={seo.title}
                />
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={seo.description}
                />
                <meta
                    head-key="og:url"
                    property="og:url"
                    content={seo.canonical}
                />
                <meta head-key="og:type" property="og:type" content="website" />
                <meta
                    head-key="og:locale"
                    property="og:locale"
                    content="es_EC"
                />
                <meta
                    head-key="og:site_name"
                    property="og:site_name"
                    content="Punto Madera"
                />
                <meta
                    head-key="twitter:card"
                    name="twitter:card"
                    content="summary"
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
                <link
                    head-key="sitemap"
                    rel="sitemap"
                    type="application/xml"
                    href={`${seo.canonical.replace(/\/resenas$/, '')}/sitemap.xml`}
                />
                <script head-key="schema" type="application/ld+json">
                    {JSON.stringify(seo.jsonLd)}
                </script>
            </Head>

            <div className="min-h-screen bg-background text-foreground">
                <PublicHeader
                    landing={{ whatsapp_number: landing.whatsapp_number }}
                />

                <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                    <section className="max-w-3xl">
                        <div className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
                            Experiencias reales · Guayaquil
                        </div>
                        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                            Opiniones de clientes
                        </h1>
                        <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                            Conoce experiencias con Punto Madera y cuéntanos
                            cómo quedó tu proyecto de muebles, puertas, closets
                            o carpintería a medida.
                        </p>
                    </section>

                    {reviewStatus && (
                        <div className="mt-8 flex items-start gap-3 rounded-md border border-primary/20 bg-secondary/50 p-4 text-sm text-primary">
                            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                            <p>{reviewStatus}</p>
                        </div>
                    )}

                    <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
                        <section aria-labelledby="published-reviews-heading">
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <div className="text-sm font-medium text-primary">
                                        Lo que cuentan nuestros clientes
                                    </div>
                                    <h2
                                        id="published-reviews-heading"
                                        className="mt-2 text-2xl font-semibold tracking-tight"
                                    >
                                        Opiniones publicadas
                                    </h2>
                                </div>
                                <Star
                                    className="size-7 text-primary"
                                    aria-hidden="true"
                                />
                            </div>

                            {reviews.length > 0 ? (
                                <div className="mt-6 grid gap-4">
                                    {reviews.map((review) => (
                                        <Card key={review.id}>
                                            <CardContent className="p-6">
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div>
                                                        <div className="font-semibold">
                                                            {review.name}
                                                        </div>
                                                        {review.location && (
                                                            <div className="mt-1 text-sm text-muted-foreground">
                                                                {
                                                                    review.location
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <RatingStars
                                                        rating={review.rating}
                                                    />
                                                </div>
                                                <p className="mt-5 text-sm leading-7 whitespace-pre-wrap text-muted-foreground">
                                                    {review.message}
                                                </p>
                                                {review.photos.length > 0 && (
                                                    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                        {review.photos.map(
                                                            (photo, index) => (
                                                                <img
                                                                    key={photo}
                                                                    src={photo}
                                                                    alt={`Foto del proyecto compartida por ${review.name} ${index + 1}`}
                                                                    className="aspect-square w-full rounded-md object-cover"
                                                                    loading="lazy"
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="mt-6">
                                    <CardContent className="p-6 text-sm leading-7 text-muted-foreground">
                                        Todavía no hay opiniones publicadas.
                                        Comparte tu experiencia; después de una
                                        breve revisión aparecerá aquí.
                                    </CardContent>
                                </Card>
                            )}
                        </section>

                        <Card className="lg:sticky lg:top-28">
                            <CardHeader>
                                <CardTitle>Comparte tu experiencia</CardTitle>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    Tu opinión nos ayuda a mejorar y orienta a
                                    otras personas. Las publicaciones se revisan
                                    antes de aparecer en la página.
                                </p>
                            </CardHeader>
                            <Separator />
                            <div className="p-6">
                                <Form
                                    {...store.form()}
                                    encType="multipart/form-data"
                                    className="grid gap-5"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="review-name">
                                                    Nombre
                                                </Label>
                                                <Input
                                                    id="review-name"
                                                    name="name"
                                                    required
                                                    maxLength={80}
                                                    placeholder="Tu nombre"
                                                />
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="review-location">
                                                    Ciudad o sector (opcional)
                                                </Label>
                                                <Input
                                                    id="review-location"
                                                    name="location"
                                                    maxLength={100}
                                                    placeholder="Guayaquil, Samborondón..."
                                                />
                                                <InputError
                                                    message={errors.location}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="review-rating">
                                                    Calificación
                                                </Label>
                                                <select
                                                    id="review-rating"
                                                    name="rating"
                                                    defaultValue="5"
                                                    required
                                                    className="h-11 w-full rounded-md border border-input bg-card px-3.5 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 md:text-sm"
                                                >
                                                    <option value="5">
                                                        5 estrellas — Excelente
                                                    </option>
                                                    <option value="4">
                                                        4 estrellas — Muy bueno
                                                    </option>
                                                    <option value="3">
                                                        3 estrellas — Bueno
                                                    </option>
                                                    <option value="2">
                                                        2 estrellas
                                                    </option>
                                                    <option value="1">
                                                        1 estrella
                                                    </option>
                                                </select>
                                                <InputError
                                                    message={errors.rating}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="review-message">
                                                    Tu opinión
                                                </Label>
                                                <textarea
                                                    id="review-message"
                                                    name="message"
                                                    required
                                                    minLength={15}
                                                    maxLength={2000}
                                                    placeholder="¿Qué trabajo realizamos y cómo fue tu experiencia?"
                                                    className="min-h-32 w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 md:text-sm"
                                                />
                                                <InputError
                                                    message={errors.message}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="review-photos">
                                                    Fotos (opcional)
                                                </Label>
                                                <Input
                                                    id="review-photos"
                                                    name="photos[]"
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    multiple
                                                />
                                                <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                                                    <Camera className="mt-0.5 size-4 shrink-0" />
                                                    Hasta 3 fotos JPG, PNG o
                                                    WEBP de máximo 5 MB cada
                                                    una.
                                                </p>
                                                <InputError
                                                    message={errors.photos}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="review-captcha">
                                                    Verificación:{' '}
                                                    {captcha.question}
                                                </Label>
                                                <Input
                                                    id="review-captcha"
                                                    name="captcha_answer"
                                                    required
                                                    inputMode="numeric"
                                                    autoComplete="off"
                                                    maxLength={10}
                                                    placeholder="Escribe el resultado"
                                                />
                                                <InputError
                                                    message={
                                                        errors.captcha_answer
                                                    }
                                                />
                                            </div>

                                            <div
                                                className="hidden"
                                                aria-hidden="true"
                                            >
                                                <Label htmlFor="review-website">
                                                    Website
                                                </Label>
                                                <Input
                                                    id="review-website"
                                                    name="website"
                                                    tabIndex={-1}
                                                    autoComplete="off"
                                                />
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <input
                                                    id="review-consent"
                                                    name="consent_to_publish"
                                                    type="checkbox"
                                                    value="1"
                                                    required
                                                    className="mt-1 size-4 rounded border-input text-primary accent-primary"
                                                />
                                                <Label
                                                    htmlFor="review-consent"
                                                    className="text-sm leading-5 font-normal"
                                                >
                                                    Acepto que publiquen mi
                                                    nombre, opinión y fotos de
                                                    este proyecto.
                                                </Label>
                                            </div>
                                            <InputError
                                                message={
                                                    errors.consent_to_publish
                                                }
                                            />

                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Enviando...'
                                                    : 'Enviar opinión'}
                                            </Button>
                                        </>
                                    )}
                                </Form>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </>
    );
}
