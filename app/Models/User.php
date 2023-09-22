<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'departement',
        'solde',
        'role',
        'password',
    ];

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

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
    public function getJWTCustomClaims()
    {
        return [];
    }
    public function demandeConges()
    {
        return $this->hasMany(Demande_conge::class, 'user_id');
    }
    public function userHistory()
    {
        return $this->hasMany(UserHistory::class, 'user_id');
    }


    public function decrementSolde($amount)
    {
        Log::info("User's solde before update: $this->solde");
        $this->solde -= $amount;
        $this->save();
        Log::info("User's solde after update: $this->solde");
    }
    public function hasSufficientSolde($durationInDays)
{
    return $this->solde >= $durationInDays;
}


protected static function booted()
    {
        static::created(function ($user) {
            $user->updateNotificationCount();
        });
    }

    public function updateNotificationCount()
    {
        if (Schema::hasColumn($this->getTable(), 'notification_count')) {
            $this->notification_count = $this->unreadNotifications->count();
            $this->save();
        }
    }
}
