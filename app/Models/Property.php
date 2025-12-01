<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',          // the creator of listing
        'owner_id',         // actual owner
        'manager_id',       // agent/manager
        'title',
        'description',
        'address',
        'city',
        'state',
        'price',
        'type',
        'bedrooms',
        'bathrooms',
        'size',
        'status',
        'image',
        'property_type',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
        'price' => 'decimal:2',
    ];

    // user who created the listing
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'managed_by');
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }

    // property has many favorites (liked by users)
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
    
    public function buildings()
    {
        return $this->hasMany(Building::class);
    }
    
}
