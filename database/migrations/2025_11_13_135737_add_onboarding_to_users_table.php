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
                $table->boolean('has_completed_onboarding')->default(false)->after('role');
                $table->string('location')->nullable();
                $table->string('interest')->nullable(); // rent, buy, lease
                $table->string('budget')->nullable();
                $table->integer('bedrooms')->nullable();
                $table->string('property_type')->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'has_completed_onboarding')) {
                $table->dropColumn('has_completed_onboarding');
            }
        });
    }
};
