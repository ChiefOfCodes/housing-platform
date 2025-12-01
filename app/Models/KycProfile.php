<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KycProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'id_number',
        'id_type',      // passport, national_id, drivers_license
        'address',
        'phone',
        'dob',
        'document_path', // stored file path to uploaded document(s)
        'status'         // pending, verified, rejected
    ];

    protected $casts = [
        'dob' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
