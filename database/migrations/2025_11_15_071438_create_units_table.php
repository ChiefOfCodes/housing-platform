<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('property_id')->constrained()->onDelete('cascade');

            $table->string('unit_name')->nullable(); // e.g. Flat A1, Room 2B
            $table->integer('floor')->nullable();
            $table->unsignedTinyInteger('bedrooms')->nullable();
            $table->unsignedTinyInteger('bathrooms')->nullable();
            $table->integer('size')->nullable(); // sq meters

            $table->decimal('rent_price', 12, 2)->nullable();

            $table->boolean('is_occupied')->default(false);

            // link to user who occupies unit
            $table->foreignId('occupied_by')->nullable()->constrained('users')->nullOnDelete();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
            $table->foreign('occupied_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('units');
    }
};
