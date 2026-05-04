<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Super Admin bypass semua check
        Gate::before(function ($user, $ability) {
            if ($user->isSuperAdmin()) {
                return true;
            }
        });

        // Gate untuk mengelola pengguna (hanya Super Admin)
        Gate::define('manage-users', function ($user) {
            return $user->isSuperAdmin();
        });

        // Gate untuk akses laporan (Admin & Super Admin)
        Gate::define('view-reports', function ($user) {
            return $user->isAdmin();
        });

        // Gate untuk kelola produk & transaksi (Admin & Super Admin)
        Gate::define('manage-products', function ($user) {
            return $user->isAdmin();
        });

        Gate::define('manage-transactions', function ($user) {
            return $user->isAdmin();
        });
    }
}
