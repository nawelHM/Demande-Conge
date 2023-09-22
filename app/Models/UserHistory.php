<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
class UserHistory extends Model
{
    protected $fillable = [
        'user_id', 'request_id', 'status',
        // Other fillable attributes
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function request()
    {
        return $this->belongsTo(Demande_conges::class, 'request_id');
    }
    public function decrementSolde($amount)
{
    Log::info("User's solde before update: $this->solde");
    $this->solde -= $amount;
    $this->save();
    Log::info("User's solde after update: $this->solde");
}
}

