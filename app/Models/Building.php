<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Building extends Model
{
    protected $fillable = [
        'property_id', 'building_name', 'floors'
    ];

    public function units()
    {
        return $this->hasMany(Unit::class);
    }
}
