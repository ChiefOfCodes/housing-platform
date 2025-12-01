<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Property;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    // Add a payment (owner/manager/admin)
    public function store(Request $request)
    {
        $request->validate([
            'property_id' => 'required|exists:properties,id',
            'unit_id'     => 'nullable|exists:units,id',
            'user_id'     => 'required|exists:users,id',
            'amount'      => 'required|numeric|min:0',
            'type'        => 'required|string',
        ]);

        $payment = Payment::create([
            'property_id' => $request->property_id,
            'unit_id'     => $request->unit_id,
            'user_id'     => $request->user_id,
            'received_by' => Auth::id(),
            'amount'      => $request->amount,
            'type'        => $request->type,
            'status'      => 'paid',
            'note'        => $request->note,
        ]);

        return response()->json([
            'message' => 'Payment recorded successfully',
            'payment' => $payment
        ]);
    }

    // Get all payments for a property
    public function forProperty($id)
    {
        $payments = Payment::where('property_id', $id)
            ->with(['tenant', 'receiver', 'unit'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($payments);
    }
}
