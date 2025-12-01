<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\KycProfile;
use App\Models\TenantInvitation;
use App\Models\Unit;


class KycController extends Controller
{
    public function submit(Request $request)
    {
        $request->validate([
            'government_id' => 'required|string',
            'id_type' => 'required|string',
            'phone' => 'required',
            'address' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string',
            'emergency_contact_phone' => 'nullable|string',
            'invitation_id' => 'nullable|integer'
        ]);


        $user = $request->user();


        $kyc = KycProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'government_id' => $request->government_id,
                'id_type' => $request->id_type,
                'phone' => $request->phone,
                'address' => $request->address,
                'emergency_contact_name' => $request->emergency_contact_name,
                'emergency_contact_phone' => $request->emergency_contact_phone,
                'notes' => $request->notes ?? null,
            ]
        );

        // mark user as tenant
        $user->status = 'tenant';
        $user->save();


        // if invitation was provided, link occupant to unit
        if ($request->invitation_id) {
            $inv = TenantInvitation::find($request->invitation_id);
            if ($inv && $inv->status === 'accepted') {
                $unit = Unit::find($inv->unit_id);
                if ($unit) {
                    $unit->occupant_id = $user->id;
                    $unit->save();
                }
            }
        }


        return response()->json(['status' => 'success', 'kyc' => $kyc]);
    }


    public function profile(Request $request)
    {
        $user = $request->user();
        $kyc = $user->kycProfile;
        return response()->json(['kyc' => $kyc]);
    }
}
