<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TenantInvitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_id',
        'property_id',
        'from_user_id',   // owner/manager who sent invitation
        'to_user_id',     // invited user (nullable if email invite)
        'to_email',       // email fallback
        'token',          // secure token for accept link
        'status',         // pending, accepted, declined, expired
        'message',
        'accepted_at',
    ];

    protected $casts = [
        'accepted_at' => 'datetime',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }
}
