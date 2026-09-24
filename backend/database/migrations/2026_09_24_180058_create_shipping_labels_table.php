<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipping_labels', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('easypost_shipment_id')->unique();
            $table->string('easypost_rate_id');

            $table->string('carrier');
            $table->string('service');

            $table->decimal('rate', 10, 2);
            $table->string('currency', 3)->default('USD');

            $table->string('tracking_code')->nullable();

            $table->text('label_url');
            $table->text('label_pdf_url')->nullable();

            $table->string('status')->default('PURCHASED');

            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipping_labels');
    }
};
