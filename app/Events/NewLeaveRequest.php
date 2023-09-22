<?php
namespace App\Events;

use App\Models\Demande_conges;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewLeaveRequest
{
    use Dispatchable, SerializesModels;

    public $demande;

    public function __construct(Demande_conges $demande)
    {
        $this->demande = $demande;
    }
}
