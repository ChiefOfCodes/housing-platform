<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // ✅ Get all users
    public function index()
    {
        try {
            $users = User::all();
            return response()->json($users, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch users.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // ✅ Update user role
    public function updateRole(Request $request, $id)
    {
        $validated = $request->validate([
            'role' => 'required|in:user,agent,owner,manager,guest,admin',
        ]);

        try {
            $user = User::findOrFail($id);
            $user->update(['role' => $validated['role']]);

            return response()->json([
                'message' => 'User role updated successfully.',
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user role.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
