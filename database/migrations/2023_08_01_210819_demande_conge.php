<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('demande_conges', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('notification_id')->nullable(); // Use unsignedBigInteger for foreign keys
             
            $table->date('date_debut');
            $table->date('date_fin');
            $table->time('temps_debut')->nullable()->default(null);
            $table->time('temps_fin')->nullable()->default(null);
            $table->string('periode')->default('');
            $table->string('type_conge');
            $table->string('raison');
            $table->string('status')->default('pending');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Add foreign key constraint for notification
            $table->foreign('notification_id')->references('id')->on('notifications')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('demande_conges');
    }
};
