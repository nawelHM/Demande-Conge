<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Carbon\Carbon;
class Demande_conges extends Model implements JWTSubject
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'notification_id',
        'date_debut',
        'date_fin',
        'temps_debut',
        'temps_fin',
        'periode',
        'type_conge',
        'raison',
        'status',
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function getJWTIdentifier(){
        return $this->getKey();
    }
    public function getJWTCustomClaims(){
        return [];
    }
    public function notifications()
{
    return $this->morphMany(Notification::class, 'notifiable');
}
public function notification()
{
    return $this->belongsTo(Notification::class);
} 
public function utilisateurs()
{
    return $this->belongsTo(User::class, 'user_id');
}
public function calculateDurationInDays()
{
    // Assuming you have 'date_debut' and 'date_fin' columns in your model
    $startDate = Carbon::parse($this->date_debut);
    $endDate = Carbon::parse($this->date_fin);

    // Calculate the difference in days
    $duration = $startDate->diffInDays($endDate);

    return $duration;
}

}


