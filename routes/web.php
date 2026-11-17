<?php

use App\Http\Controllers\Admin\CatalogAdminController;
use App\Http\Controllers\Admin\ContactMessageAdminController;
use App\Http\Controllers\Admin\HomeLandingAdminController;
use App\Http\Controllers\Admin\McpChangeLogAdminController;
use App\Http\Controllers\Admin\PartnerAdminController;
use App\Http\Controllers\Admin\QuoteAdminController;
use App\Http\Controllers\Admin\QuoteRequestAdminController;
use App\Http\Controllers\Admin\QuoteSettingsAdminController;
use App\Http\Controllers\Admin\ReviewAdminController;
use App\Http\Controllers\Admin\ServiceAdminController;
use App\Http\Controllers\Admin\ServiceBookingAdminController;
use App\Http\Controllers\Admin\ServiceZoneAdminController;
use App\Http\Controllers\Admin\WorkAdminController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\ContactPageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeLandingController;
use App\Http\Controllers\LlmsTxtController;
use App\Http\Controllers\LocalSeoPageController;
use App\Http\Controllers\MoneyPageController;
use App\Http\Controllers\QuotePublicController;
use App\Http\Controllers\QuoteRequestController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ReviewPhotoController;
use App\Http\Controllers\ServiceBookingController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\WorkController;
use App\Http\Middleware\AdminOnly;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeLandingController::class, 'show'])->name('home');
Route::get('/sitemap.xml', [LocalSeoPageController::class, 'sitemap'])->name('sitemap');
Route::get('/llms.txt', [LlmsTxtController::class, 'index'])->name('llms');
Route::get('/llms-full.txt', [LlmsTxtController::class, 'full'])->name('llms.full');
Route::permanentRedirect('/llm.txt', '/llms.txt');

Route::redirect('/carpintero-guayaquil', '/');

// The storefront was removed but Google still crawls its URLs (shelves, panels, desks):
// send them to the custom furniture page instead of a 404.
Route::permanentRedirect('/tienda', '/carpinteria-a-medida-guayaquil');
Route::permanentRedirect('/tienda/{product}', '/carpinteria-a-medida-guayaquil')
    ->where('product', '.*');
Route::get('/instalacion-puertas-guayaquil', [LocalSeoPageController::class, 'show'])
    ->defaults('slug', 'instalacion-puertas-guayaquil')
    ->name('seo.doors.installation');
Route::get('/reparacion-puertas-guayaquil', [LocalSeoPageController::class, 'show'])
    ->defaults('slug', 'reparacion-puertas-guayaquil')
    ->name('seo.doors.repair');
Route::get('/carpinteria-a-medida-guayaquil', [LocalSeoPageController::class, 'show'])
    ->defaults('slug', 'carpinteria-a-medida-guayaquil')
    ->name('seo.custom.carpentry');
Route::get('/puertas-madera-chapas-guayaquil', [LocalSeoPageController::class, 'show'])
    ->defaults('slug', 'puertas-madera-chapas-guayaquil')
    ->name('seo.doors.products');
Route::get('/muebles-resistentes-humedad-guayaquil', [LocalSeoPageController::class, 'show'])
    ->defaults('slug', 'muebles-resistentes-humedad-guayaquil')
    ->name('seo.guides.humidity');
Route::get('/comejen-puertas-muebles-guayaquil', [LocalSeoPageController::class, 'show'])
    ->defaults('slug', 'comejen-puertas-muebles-guayaquil')
    ->name('seo.guides.termites');
Route::get('/puertas-seguridad-guayaquil', [LocalSeoPageController::class, 'show'])
    ->defaults('slug', 'puertas-seguridad-guayaquil')
    ->name('seo.guides.security');

Route::get('/casa-nueva-guayaquil', [MoneyPageController::class, 'casaNueva'])->name('money.casa-nueva');
Route::get('/empresas', [MoneyPageController::class, 'empresas'])->name('money.empresas');

Route::get('/contacto', [ContactPageController::class, 'show'])->name('contact.show');
Route::get('/trabajos', [WorkController::class, 'index'])->name('works.index');
Route::get('/resenas', [ReviewController::class, 'index'])->name('reviews.index');
Route::post('/resenas', [ReviewController::class, 'store'])
    ->middleware('throttle:5,10')
    ->name('reviews.store');
Route::get('/resenas/{review}/foto/{photo}', [ReviewPhotoController::class, 'show'])
    ->where('photo', '[^/]+')
    ->name('reviews.photo');
Route::get('/servicios', [ServiceController::class, 'index'])->name('services.index');
Route::get('/servicios/{service:slug}', [ServiceController::class, 'show'])->name('services.show');

Route::get('/cotizar', [QuoteRequestController::class, 'create'])->name('quote-requests.create');
Route::post('/cotizar', [QuoteRequestController::class, 'store'])
    ->middleware('throttle:5,10')
    ->name('quote-requests.store');
Route::get('/cotizar/enviado/{reference}', [QuoteRequestController::class, 'sent'])->name('quote-requests.sent');
Route::get('/cotizacion/{token}', [QuotePublicController::class, 'show'])
    ->where('token', '[A-Za-z0-9]{40,64}')
    ->name('quotes.public.show');
Route::post('/cotizacion/{token}/aceptar', [QuotePublicController::class, 'accept'])
    ->where('token', '[A-Za-z0-9]{40,64}')
    ->middleware('throttle:10,1')
    ->name('quotes.public.accept');
Route::post('/cotizacion/{token}/pago', [QuotePublicController::class, 'reportPayment'])
    ->where('token', '[A-Za-z0-9]{40,64}')
    ->middleware('throttle:10,1')
    ->name('quotes.public.payment');
Route::get('/cotizacion-qr', [QuoteSettingsAdminController::class, 'qr'])->name('quote-settings.qr');

Route::post('/bookings', [ServiceBookingController::class, 'store'])->name('bookings.store');
Route::post('/contact', [ContactMessageController::class, 'store'])->name('contact.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::prefix('admin')->middleware(AdminOnly::class)->group(function () {
        Route::get('home', [HomeLandingAdminController::class, 'edit'])->name('admin.home.edit');
        Route::put('home', [HomeLandingAdminController::class, 'update'])->name('admin.home.update');

        Route::get('bookings', [ServiceBookingAdminController::class, 'index'])->name('admin.bookings.index');
        Route::patch('bookings/{booking}', [ServiceBookingAdminController::class, 'update'])->name('admin.bookings.update');

        Route::get('contacts', [ContactMessageAdminController::class, 'index'])->name('admin.contacts.index');
        Route::patch('contacts/{contact}', [ContactMessageAdminController::class, 'update'])->name('admin.contacts.update');

        Route::get('reviews', [ReviewAdminController::class, 'index'])->name('admin.reviews.index');
        Route::patch('reviews/{review}', [ReviewAdminController::class, 'update'])->name('admin.reviews.update');

        Route::get('services', [ServiceAdminController::class, 'index'])->name('admin.services.index');
        Route::post('services', [ServiceAdminController::class, 'store'])->name('admin.services.store');
        Route::patch('services/{service}', [ServiceAdminController::class, 'update'])->name('admin.services.update');
        Route::delete('services/{service}', [ServiceAdminController::class, 'destroy'])->name('admin.services.destroy');

        Route::get('solicitudes', [QuoteRequestAdminController::class, 'index'])->name('admin.quote-requests.index');
        Route::patch('solicitudes/{quoteRequest}', [QuoteRequestAdminController::class, 'update'])->name('admin.quote-requests.update');
        Route::get('solicitudes/{quoteRequest}/foto/{index}', [QuoteRequestAdminController::class, 'photo'])
            ->whereNumber('index')
            ->name('admin.quote-requests.photo');

        Route::get('cotizaciones', [QuoteAdminController::class, 'index'])->name('admin.quotes.index');
        Route::get('cotizaciones/crear', [QuoteAdminController::class, 'create'])->name('admin.quotes.create');
        Route::post('cotizaciones', [QuoteAdminController::class, 'store'])->name('admin.quotes.store');
        Route::get('cotizaciones/{quote}/editar', [QuoteAdminController::class, 'edit'])->name('admin.quotes.edit');
        Route::put('cotizaciones/{quote}', [QuoteAdminController::class, 'update'])->name('admin.quotes.update');
        Route::post('cotizaciones/{quote}/enviada', [QuoteAdminController::class, 'markSent'])->name('admin.quotes.sent');
        Route::post('cotizaciones/{quote}/duplicar', [QuoteAdminController::class, 'duplicate'])->name('admin.quotes.duplicate');
        Route::post('cotizaciones/{quote}/pagada', [QuoteAdminController::class, 'markPaid'])->name('admin.quotes.paid');

        Route::get('historial-ia', [McpChangeLogAdminController::class, 'index'])->name('admin.ai-history.index');

        Route::get('catalogo', [CatalogAdminController::class, 'index'])->name('admin.catalog.index');
        Route::post('catalogo', [CatalogAdminController::class, 'store'])->name('admin.catalog.store');
        Route::post('catalogo/ajustar-precios', [CatalogAdminController::class, 'adjustPrices'])->name('admin.catalog.adjust');
        Route::patch('catalogo/{item}', [CatalogAdminController::class, 'update'])->name('admin.catalog.update');
        Route::post('catalogo/{item}/sugerencias', [CatalogAdminController::class, 'storeSuggestion'])->name('admin.catalog.suggestions.store');
        Route::delete('catalogo/{item}/sugerencias/{suggested}', [CatalogAdminController::class, 'destroySuggestion'])->name('admin.catalog.suggestions.destroy');

        Route::get('zonas', [ServiceZoneAdminController::class, 'index'])->name('admin.zones.index');
        Route::post('zonas', [ServiceZoneAdminController::class, 'store'])->name('admin.zones.store');
        Route::patch('zonas/{zone}', [ServiceZoneAdminController::class, 'update'])->name('admin.zones.update');

        Route::get('aliados', [PartnerAdminController::class, 'index'])->name('admin.partners.index');
        Route::post('aliados', [PartnerAdminController::class, 'store'])->name('admin.partners.store');
        Route::patch('aliados/{partner}', [PartnerAdminController::class, 'update'])->name('admin.partners.update');

        Route::get('ajustes-cotizacion', [QuoteSettingsAdminController::class, 'edit'])->name('admin.quote-settings.edit');
        Route::post('ajustes-cotizacion', [QuoteSettingsAdminController::class, 'update'])->name('admin.quote-settings.update');

        Route::get('works', [WorkAdminController::class, 'index'])->name('admin.works.index');
        Route::post('works', [WorkAdminController::class, 'store'])->name('admin.works.store');
        Route::patch('works/{work}', [WorkAdminController::class, 'update'])->name('admin.works.update');
        Route::delete('works/{work}', [WorkAdminController::class, 'destroy'])->name('admin.works.destroy');
    });
});

require __DIR__.'/settings.php';
