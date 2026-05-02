<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ReAuthenticateController extends Controller
{
    public function reAuthenticate(Request $request)
    {
        try {
            $request->validate([
                'password' => 'required|string',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'errors' => $e->errors(),
            ], 422);
        }

        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Session expired'], 401);
        }

        if (Hash::check($request->password, $user->password)) {
            $request->session()->regenerate();
            return response()->json(['success' => true]);
        }

        return response()->json([
            'errors' => [
                'password' => ['Password salah']
            ]
        ], 422);
    }
}
