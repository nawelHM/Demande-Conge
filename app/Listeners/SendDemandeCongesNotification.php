<?php
namespace App\Listeners;

use App\Events\NewLeaveRequest;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notifications\NotifConge;
use App\Models\User;
use Illuminate\Support\Facades\Log;
class SendNewLeaveRequestNotification implements ShouldQueue
{
    public function handle(NewLeaveRequest $event)
{
    $demande = $event->demande;
    Log::debug('Listener handling event: SendNewLeaveRequestNotification');
    
    $adminsAndHR = User::whereIn('role', ['admin', 'rh'])->get();
    Log::debug('Recipients count: ' . $adminsAndHR->count());

    foreach ($adminsAndHR as $recipient) {
        Log::debug('Sending notification to user: ' . $recipient->id);
        $recipient->notify(new NotifConge($demande));
    }
}

}
