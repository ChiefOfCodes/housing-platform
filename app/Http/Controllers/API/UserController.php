<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    // 🔹 Return the profile of the logged-in user
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    // 🔹 List all users (admin only)
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admins only.'], 403);
        }

        $users = User::select('id', 'name', 'email', 'role', 'created_at')->get();

        return response()->json([
            'status' => 'success',
            'users' => $users
        ]);
    }

    // 🔹 Update a user's role (admin only)
    public function updateRole(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Admins only.'], 403);
        }

        $validated = $request->validate([
            'role' => 'required|in:admin,agent,owner,manager,user,guest',
        ]);

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->role = $validated['role'];
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'User role updated successfully',
            'user' => $user
        ]);
    }

    public function completeOnboarding(Request $request)
    {
        $user = $request->user();

        $user->update([
            'preferred_state'     => $request->preferred_state,
            'preferred_city'      => $request->preferred_city,
            'property_interest'   => $request->property_interest,
            'budget'              => $request->budget,
            'preferred_type'      => $request->preferred_type,
            'has_completed_onboarding' => true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Onboarding completed',
            'user' => $user
        ]);
    }


    public function skipOnboarding(Request $request)
    {
        $user = $request->user();
        $user->has_completed_onboarding = true;
        $user->save();

        return response()->json(['status' => 'success']);
    }
}
