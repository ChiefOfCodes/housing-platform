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

            if (!Schema::hasColumn('users', 'preferred_location')) {
                $table->string('preferred_location')->nullable();
            }

            if (!Schema::hasColumn('users', 'property_interest')) {
                $table->string('property_interest')->nullable(); // rent or buy
            }
        });
    }


    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'has_completed_onboarding',
                'preferred_location',
                'property_interest',
            ]);
        });
    }
};
