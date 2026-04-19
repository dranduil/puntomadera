<?php

use App\Http\Controllers\Admin\ContactMessageAdminController;
use App\Http\Controllers\Admin\HomeLandingAdminController;
use App\Http\Controllers\Admin\ServiceAdminController;
use App\Http\Controllers\Admin\ServiceBookingAdminController;
use App\Http\Controllers\Admin\WorkAdminController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\ContactPageController;
use App\Http\Controllers\HomeLandingController;
use App\Http\Controllers\ServiceBookingController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\WorkController;
use App\Http\Middleware\AdminOnly;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeLandingController::class, 'show'])->name('home');

Route::redirect('/carpintero-guayaquil', '/');

Route::get('/contacto', [ContactPageController::class, 'show'])->name('contact.show');
Route::get('/trabajos', [WorkController::class, 'index'])->name('works.index');
Route::get('/tienda', [ShopController::class, 'index'])->name('shop.index');
Route::get('/tienda/carrito', [ShopController::class, 'cart'])->name('shop.cart');
Route::get('/tienda/{service:slug}', [ShopController::class, 'show'])->name('shop.show');
Route::get('/servicios', [ServiceController::class, 'index'])->name('services.index');
Route::get('/servicios/{service:slug}', [ServiceController::class, 'show'])->name('services.show');

Route::post('/bookings', [ServiceBookingController::class, 'store'])->name('bookings.store');
Route::post('/contact', [ContactMessageController::class, 'store'])->name('contact.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('admin')->middleware(AdminOnly::class)->group(function () {
        Route::get('home', [HomeLandingAdminController::class, 'edit'])->name('admin.home.edit');
        Route::put('home', [HomeLandingAdminController::class, 'update'])->name('admin.home.update');

        Route::get('bookings', [ServiceBookingAdminController::class, 'index'])->name('admin.bookings.index');
        Route::patch('bookings/{booking}', [ServiceBookingAdminController::class, 'update'])->name('admin.bookings.update');

        Route::get('contacts', [ContactMessageAdminController::class, 'index'])->name('admin.contacts.index');
        Route::patch('contacts/{contact}', [ContactMessageAdminController::class, 'update'])->name('admin.contacts.update');

        Route::get('services', [ServiceAdminController::class, 'index'])->name('admin.services.index');
        Route::post('services', [ServiceAdminController::class, 'store'])->name('admin.services.store');
        Route::patch('services/{service}', [ServiceAdminController::class, 'update'])->name('admin.services.update');
        Route::delete('services/{service}', [ServiceAdminController::class, 'destroy'])->name('admin.services.destroy');

        Route::get('works', [WorkAdminController::class, 'index'])->name('admin.works.index');
        Route::post('works', [WorkAdminController::class, 'store'])->name('admin.works.store');
        Route::patch('works/{work}', [WorkAdminController::class, 'update'])->name('admin.works.update');
        Route::delete('works/{work}', [WorkAdminController::class, 'destroy'])->name('admin.works.destroy');
    });
});

require __DIR__.'/settings.php';
