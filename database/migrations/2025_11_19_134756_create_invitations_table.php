<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tenant_invitations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('unit_id')->nullable()->constrained('units')->nullOnDelete();
            $table->foreignId('property_id')->nullable()->constrained('properties')->nullOnDelete();

            $table->foreignId('from_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('to_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('to_email')->nullable(); // if inviting by email
            $table->string('token', 80)->unique();

            $table->enum('status', ['pending', 'accepted', 'declined', 'expired'])
                ->default('pending');

            $table->text('message')->nullable();
            $table->timestamp('accepted_at')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tenant_invitations');
    }
};
