<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Demande_conges;
use Illuminate\Support\Str; 
use Illuminate\Support\Facades\Log;

class NotifConge extends Notification
{
    use Queueable;
    protected $demandeConges;
    protected $name;
    protected $prenom;
    protected $raison;
    protected $temps_debut;
    protected $temps_fin;
    protected $periode;
    protected $type_conge;
    protected $user_id;
    protected $notification_id;
    public function __construct(Demande_conges $demandeConges)
    {
        $this->demandeConges = $demandeConges;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    public function toArray($notifiable)
    {
        $user = $this->demandeConges->user; // Assuming there's a 'user' relationship
        Log::info('Notification Data:', [
            'id' => $this->demandeConges->id,
            'demande_id' => $this->demandeConges->id, 
            'message' => 'à ajouter une nouvelle demande de congé ',
            'notification_id' => $this->id,
            'user_id' => $this->demandeConges->user->id,
            'date_debut' => $this->demandeConges->date_debut,
            'date_fin' => $this->demandeConges->date_fin,
            'nom' => $this->demandeConges->user->nom,
            'prenom' => $this->demandeConges->user->prenom,
            'temps_debut' => $this->demandeConges->temps_debut,
            'temps_fin' => $this->demandeConges->temps_fin,
            'periode' => $this->demandeConges->periode,
            'type_conge' => $this->demandeConges->type_conge,
            'raison' => $this->demandeConges->raison,
        ]);
    
        return [
            'id' => $this->demandeConges->id,
            'demande_id' => $this->demandeConges->id, 
            'message' => 'à ajouter une nouvelle demande de congé ',
            'notification_id' => $this->id,
            'user_id' => $this->demandeConges->user->id,
            'date_debut' => $this->demandeConges->date_debut,
            'date_fin' => $this->demandeConges->date_fin,
            'nom' => $this->demandeConges->user->nom,
            'prenom' => $this->demandeConges->user->prenom,
            'temps_debut'=>$this->demandeConges->temps_debut,
            'temps_fin'=>$this->demandeConges->temps_fin,
            'periode'=>$this->demandeConges->periode,
            'type_conge'=>$this->demandeConges->type_conge,
            'raison' => $this->demandeConges->raison,

            
        ];
    }
}
