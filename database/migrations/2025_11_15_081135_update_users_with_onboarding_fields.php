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
        Schema::table('users', function (Blueprint $table) {

            if (!Schema::hasColumn('users', 'has_completed_onboarding')) {
                $table->boolean('has_completed_onboarding')->default(false);
            }

            if (!Schema::hasColumn('users', 'preferred_state')) {
                $table->string('preferred_state')->nullable();
            }

            if (!Schema::hasColumn('users', 'preferred_city')) {
                $table->string('preferred_city')->nullable();
            }

            if (!Schema::hasColumn('users', 'property_interest')) {
                $table->string('property_interest')->nullable(); // rent, buy, shortlet
            }

            if (!Schema::hasColumn('users', 'budget')) {
                $table->string('budget')->nullable();
            }

            if (!Schema::hasColumn('users', 'preferred_type')) {
                $table->string('preferred_type')->nullable();
            }

            if (!Schema::hasColumn('users', 'extra_notes')) {
                $table->text('extra_notes')->nullable();
            }
        });
    }
};
