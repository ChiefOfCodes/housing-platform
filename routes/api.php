<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\TenantInvitationController;
use App\Http\Controllers\Api\KycController;


// PUBLIC ROUTES
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);

// AUTH ROUTES
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/profile', [UserController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
});

// ✅ ADMIN ROUTES
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::get('admin/users', [AdminController::class, 'index']);
    Route::put('admin/users/{id}/role', [AdminController::class, 'updateRole']);
});

// Onboarding completion route
Route::middleware('auth:sanctum')->post('/complete-onboarding', [UserController::class, 'completeOnboarding']);
Route::middleware('auth:sanctum')->post('/skip-onboarding', [UserController::class, 'skipOnboarding']);


Route::middleware('auth:sanctum')->group(function () {
    // favorites
    Route::post('/properties/{id}/favorite', [PropertyController::class, 'toggleFavorite']);
    // owner/agent add property
    Route::post('/properties', [PropertyController::class, 'store']);
    // Update / delete only via role checks inside controller (owner/manager/agent/admin)
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);

    // Get properties for current user (owner/agent)
    Route::get('/my/properties', [PropertyController::class, 'myProperties']);

    // Units & occupants
    Route::post('/properties/{id}/units', [PropertyController::class, 'addUnit']); // owner/manager/agent
    Route::put('/units/{id}', [PropertyController::class, 'updateUnit']);
    Route::post('/units/{id}/assign-occupant', [PropertyController::class, 'assignOccupant']);

    // payments (manager/owner)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::get('/payments/property/{id}', [PaymentController::class, 'forProperty']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        // Invitations
        Route::post('/units/{unit}/invite', [TenantInvitationController::class, 'invite']);
        Route::get('/invitations', [TenantInvitationController::class, 'myInvitations']);
        Route::post('/invitations/{id}/accept', [TenantInvitationController::class, 'accept']);
        Route::post('/invitations/{id}/decline', [TenantInvitationController::class, 'decline']);


        // KYC
        Route::post('/kyc', [KycController::class, 'submit']);
        Route::get('/kyc', [KycController::class, 'profile']);
    });
});
