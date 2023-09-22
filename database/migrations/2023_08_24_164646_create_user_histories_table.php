<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserHistoriesTable extends Migration
{
    public function up()
    {
        Schema::create('user_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('request_id');
            $table->string('status'); // For example, 'accepted' or 'refused'
            $table->timestamps();

            // Define foreign key constraints if needed
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('request_id')->references('id')->on('demande_conges');
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_histories');
    }
}
