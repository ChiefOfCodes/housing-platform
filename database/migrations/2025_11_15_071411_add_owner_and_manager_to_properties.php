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
        Schema::table('properties', function (Blueprint $table) {
            if (!Schema::hasColumn('properties', 'owner_id')) {
                $table->unsignedBigInteger('owner_id')->nullable()->after('user_id');
            }

            if (!Schema::hasColumn('properties', 'managed_by')) {
                $table->unsignedBigInteger('managed_by')->nullable()->after('owner_id');
            }

            $table->foreign('owner_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('managed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropForeign(['owner_id']);
            $table->dropForeign(['manager_id']);
            $table->dropColumn(['owner_id', 'manager_id']);
        });
    }
};
