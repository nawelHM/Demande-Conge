<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\DatabaseMessage;

class RequestRefusedNotification extends Notification
{
    use Queueable;
    public function via($notifiable)
    {
        return ['database']; // You can add other channels like 'mail', 'sms', etc.
    }
    public function toDatabase($notifiable)
    {
        return [
            'message' => 'Nous sommes désolés, mais votre demande de congé a été refusée. Vous pouvez contacter le service des ressources humaines pour plus de détails.',
            'status' => 'refused',
        ];
    }

    public function toArray($notifiable)
    {
        return [
            // Additional data to be sent in the notification
        ];
    }
}
