<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\DatabaseMessage;
use App\Models\UserHistory; // Import the UserHistory model

class RequestAcceptedNotification extends Notification
{
    use Queueable;

    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }
    public function via($notifiable)
    {
        return ['database']; // You can add other channels like 'mail', 'sms', etc.
    }
    public function toDatabase($notifiable)
    {
        // Create a new UserHistory entry
        $userHistory = new UserHistory([
            'user_id' => $notifiable->id, // Assuming the notifiable is a user
            'request_id' => $this->request->id,
            'status' => 'accepted',
        ]);
        $userHistory->save();

        return [
            'message' => 'Félicitations ! Votre demande de congé a été acceptée.',
            'status' => 'accepted',
        ];
    }

    public function toArray($notifiable)
    {
        return [
            // Additional data to be sent in the notification
        ];
    }
}
