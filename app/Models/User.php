<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'has_completed_onboarding',
        'preferred_state',
        'preferred_city',
        'property_interest',
        'budget',
        'preferred_type',
        'extra_notes',
    ];


    /**
     * The attributes that should be hidden for arrays and JSON.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'has_completed_onboarding' => 'boolean',
    ];

    /**
     * Helper to check user role easily.
     */
    public function isRole($role)
    {
        return $this->role === $role;
    }
    public function kycProfile()
    {
        return $this->hasOne(\App\Models\KycProfile::class);
    }
    public function invitations()
    {
        return $this->hasMany(\App\Models\TenantInvitation::class, 'invited_user_id');
    }
}
