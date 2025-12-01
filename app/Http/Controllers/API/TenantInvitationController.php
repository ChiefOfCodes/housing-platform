<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TenantInvitation;
use App\Models\Unit;
use App\Models\User;


class TenantInvitationController extends Controller
{
    // Send invitation (owner/manager)
    public function invite(Request $request, $unitId)
    {
        $request->validate([
            'identifier' => 'required|string'
        ]);


        $unit = Unit::findOrFail($unitId);


        // find user by id|email|name
        $identifier = $request->identifier;
        $user = User::where('id', $identifier)
            ->orWhere('email', $identifier)
            ->orWhere('name', $identifier)
            ->first();


        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // create invitation
        $inv = TenantInvitation::create([
            'unit_id' => $unit->id,
            'invited_user_id' => $user->id,
            'invited_by_user_id' => $request->user()->id,
            'status' => 'pending',
            'note' => $request->note ?? null,
        ]);


        // set user status to invited (optional)
        $user->status = 'invited';
        $user->save();


        // TODO: dispatch notification/email


        return response()->json(['status' => 'success', 'invitation' => $inv], 201);
    }


    // user lists invitations addressed to them
    public function myInvitations(Request $request)
    {
        $user = $request->user();
        $invs = TenantInvitation::with('unit', 'inviter')->where('invited_user_id', $user->id)->get();
        return response()->json(['invitations' => $invs]);
    }

    // accept invitation
    public function accept(Request $request, $id)
    {
        $inv = TenantInvitation::findOrFail($id);
        $user = $request->user();
        if ($inv->invited_user_id !== $user->id) return response()->json(['message' => 'Forbidden'], 403);


        $inv->status = 'accepted';
        $inv->save();


        // set user status and link to unit as pending KYC
        $user->status = 'pending_kyc';
        $user->save();


        // optionally reserve the unit (do not finalize occupant until KYC completed)
        $unit = $inv->unit;
        $unit->reserved_for = $user->id; // add column if you want reservation
        $unit->save();


        return response()->json(['status' => 'ok', 'invitation' => $inv]);
    }


    public function decline(Request $request, $id)
    {
        $inv = TenantInvitation::findOrFail($id);
        $user = $request->user();
        if ($inv->invited_user_id !== $user->id) return response()->json(['message' => 'Forbidden'], 403);


        $inv->status = 'declined';
        $inv->save();


        return response()->json(['status' => 'ok']);
    }
}
