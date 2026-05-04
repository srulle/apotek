<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $this->authorize('manage-users');

        $users = User::select('id', 'name', 'email', 'role', 'email_verified_at', 'created_at')
            ->where('role', '!=', 'super_admin')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('pengguna', [
            'users' => $users,
        ]);
    }

    public function verify(Request $request, User $user)
    {
        $this->authorize('manage-users');

        $user->update([
            'email_verified_at' => now(),
        ]);

        return back()->with('success', 'Pengguna berhasil diverifikasi');
    }

    public function unverify(Request $request, User $user)
    {
        $this->authorize('manage-users');

        $user->update([
            'email_verified_at' => null,
        ]);

        return back()->with('success', 'Verifikasi pengguna berhasil dibatalkan');
    }
}
