<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {

            // Add columns if missing
            if (!Schema::hasColumn('properties', 'owner_id')) {
                $table->unsignedBigInteger('owner_id')->nullable()->after('id');
            }

            if (!Schema::hasColumn('properties', 'manager_id')) {
                $table->unsignedBigInteger('manager_id')->nullable()->after('owner_id');
            }
        });

        // Add FKs only if they do NOT already exist
        $this->addForeignKeyIfMissing(
            'properties',
            'owner_id',
            'properties_owner_id_foreign'
        );

        $this->addForeignKeyIfMissing(
            'properties',
            'manager_id',
            'properties_manager_id_foreign'
        );
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            if (Schema::hasColumn('properties', 'owner_id')) {
                $table->dropForeign(['owner_id']);
                $table->dropColumn('owner_id');
            }

            if (Schema::hasColumn('properties', 'manager_id')) {
                $table->dropForeign(['manager_id']);
                $table->dropColumn('manager_id');
            }
        });
    }

    private function addForeignKeyIfMissing($table, $column, $fkName)
    {
        $exists = DB::select("
            SELECT CONSTRAINT_NAME 
            FROM information_schema.KEY_COLUMN_USAGE 
            WHERE TABLE_NAME = '{$table}' 
            AND COLUMN_NAME = '{$column}' 
            AND CONSTRAINT_NAME = '{$fkName}'
        ");

        if (empty($exists)) {
            Schema::table($table, function (Blueprint $table) use ($column, $fkName) {
                $table->foreign($column, $fkName)
                    ->references('id')->on('users')
                    ->onDelete('set null');
            });
        }
    }
};
