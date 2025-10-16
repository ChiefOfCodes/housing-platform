<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
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
        'image',
    ];

    // Relationship: A property belongs to a user (owner)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
