<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ShipmentLabelController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/shipping-labels', [ShipmentLabelController::class, 'store']);

    Route::get('/shipping-labels', [ShipmentLabelController::class, 'index']);

    Route::get('/shipping-labels/{id}', [ShipmentLabelController::class, 'show']);
});
