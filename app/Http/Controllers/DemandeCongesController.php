<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use App\Models\Demande_conges;
use App\Notifications\NotifConge;
use Illuminate\Http\Response;
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;
use App\Events\NewLeaveRequest;
use Illuminate\Support\Str;
class DemandeCongesController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required',
            'date_debut' => 'required',
            'date_fin' => 'required',
            'temps_debut' => 'nullable',
            'temps_fin' => 'nullable',
            'periode' => 'nullable',
     
            'type_conge' => 'required',
            'raison' => 'required',
            'status',
            
        ]);

        $demandeConges = Demande_conges::create($validatedData);

        $users = User::whereIn('role', ['admin', 'rh'])->get();

        Notification::send($users, new NotifConge($demandeConges));
        Log::debug('Demande saved. Dispatching event...');

        // Uncomment if you're using events
        // event(new NewLeaveRequest($demandeConges));

        Log::debug('Event dispatched.');

        return response()->json([
            'message' => 'Demande de congés added successfully',
            'demande' => $demandeConges,
        ], Response::HTTP_CREATED);
    }

    public function lister()
    {
        $demandes = Demande_conges::all();
        return response()->json(['demandes' => $demandes], Response::HTTP_OK);
    }
    public function Demande()
{
    $user = Auth::user(); // Récupérer l'utilisateur authentifié
    $demandes = Demande_conges::where('user_id', $user->id)->get();

    return response()->json(['demandes' => $demandes], Response::HTTP_OK);
}

public function getDemandesByUserId($userId) {
    $demandes = Demande_conges::where('user_id', $userId)->get();
    return response()->json(['demandes' => $demandes], Response::HTTP_OK);
}
public function getDemandeByNotificationId($notificationId)
{
    $demande = Demande_conges::where('notification_id', $notificationId)->first();

    if ($demande) {
        return response()->json(['demande' => $demande], Response::HTTP_OK);
    } else {
        return response()->json(['message' => 'Demande not found'], Response::HTTP_NOT_FOUND);
    }
}

public function index()
{
    $demandesConge = Demande_conges::with('utilisateurs')->get();
    
    return response()->json($demandesConge);
}

}
