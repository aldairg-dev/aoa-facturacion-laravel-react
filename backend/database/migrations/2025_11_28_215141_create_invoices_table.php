<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();

            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('user_id');

            $table->foreign('client_id')
                ->references('id')
                ->on('clients')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->date('invoice_date');
            $table->date('due_date');

            $table->enum('invoice_type', ['cash', 'credit']);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax_total', 10, 2);
            $table->decimal('total', 10, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
