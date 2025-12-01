<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'unit_name',
        'floor',
        'bedrooms',
        'bathrooms',
        'size',
        'rent_price',
        'is_occupied',
        'occupied_by',
        'building_id',       
    ];

    protected $casts = [
        'is_occupied' => 'boolean',
        'rent_price' => 'decimal:2',
    ];

    /**
     * Relationship to Property
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Relationship to tenant/user who occupies this unit
     */
    public function occupant()
    {
        return $this->belongsTo(User::class, 'occupied_by');
    }

    /**
     * Relationship to invitations sent for this unit
     */
    public function invitations()
    {
        return $this->hasMany(TenantInvitation::class);
    }

    /**
     * Get the tenant's KYC profile through the occupant
     */
    public function occupantKyc()
    {
        return $this->hasOneThrough(
            KycProfile::class,
            User::class,
            'id',           // User id
            'user_id',      // KYC belongs_to user_id
            'occupied_by',  // Unit.occupied_by
            'id'            // User.id
        );
    }
}
