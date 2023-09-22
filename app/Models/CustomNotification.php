<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
class CustomNotification extends Model implements JWTSubject
{
    protected $table = 'notifications';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'type',
        'data',
        'read_at',
        'notifiable_id',
        'notifiable_type',
        
        
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'read_at',
    ];

    /**
     * Get the notifiable entity's notifications.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function notifiable()
    {
        return $this->morphTo();
    }
    // In Demande_conges model
public function notifications()
{
    return $this->morphMany(CustomNotification::class, 'notifiable');
}

public function getJWTIdentifier(){
    return $this->getKey();
}
public function getJWTCustomClaims(){
    return [];
}
public function markAsRead()
    {
        if (!$this->read_at) {
            $this->forceFill(['read_at' => $this->freshTimestamp()])->save();
        }
    }
}
