<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('payments')) return;

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('property_id')->nullable()->index();
            $table->unsignedBigInteger('unit_id')->nullable()->index();
            $table->unsignedBigInteger('user_id')->index(); // payer
            $table->unsignedBigInteger('received_by')->nullable()->index(); // owner/manager
            $table->decimal('amount', 14, 2);
            $table->string('type')->default('rent'); // rent, utility, deposit
            $table->string('status')->default('paid'); // pending, paid, failed
            $table->text('note')->nullable();
            $table->timestamps();

            $table->foreign('property_id')->references('id')->on('properties')->nullOnDelete();
            $table->foreign('unit_id')->references('id')->on('units')->nullOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('received_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
