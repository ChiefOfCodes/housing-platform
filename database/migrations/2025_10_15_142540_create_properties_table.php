<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('address');
            $table->string('city');
            $table->string('state');
            $table->decimal('price', 12, 2);
            $table->enum('type', ['rent', 'sale']);
            $table->integer('bedrooms')->default(0);
            $table->integer('bathrooms')->default(0);
            $table->float('size')->nullable();
            $table->string('image')->nullable(); // optional single image
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
