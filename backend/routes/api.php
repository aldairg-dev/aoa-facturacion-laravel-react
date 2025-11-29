<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('aoa')->group(function () {

    Route::get('/products', [ProductController::class, 'index'])->name('getProducts');
    Route::get('/products/{id}', [ProductController::class, 'show'])->name('getByIdProduct');
    Route::post('/products', [ProductController::class, 'store'])->name('storeProducts');

    Route::get('/clients', [ClientController::class, 'index'])->name('getClients');
    Route::get('/clients/{client_identification}', [ClientController::class, 'show'])->name('getByIdClients');
    Route::post('/clients', [ClientController::class, 'store'])->name('storeClients');

    Route::get('/factures', [InvoiceController::class, 'index'])->name('getFactures');
    Route::get('/factures/{id}', [InvoiceController::class, 'show'])->name('getByIdFactures');
    Route::post('/factures', [InvoiceController::class, 'store'])->name('storeFactures');
});
