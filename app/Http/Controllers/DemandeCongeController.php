<?php
// Assuming the controller is named DemandeCongeController and has been created using the make:controller command

namespace App\Http\Controllers;

use App\Models\Demande_conge;
use App\Models\Demande_conges;
use Illuminate\Http\Request;


class DemandeCongeController extends Controller
{
    public function demandeconge(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'user_id' => 'required',
            'date_debut' => 'required',
            'date_fin' => 'required',
            'type_conge' => 'required',
            'raison' => 'required',
            'temps' => 'required',
            
        ]);

        // Create and save the Demande_conge entry
        $demandeConge = Demande_conges::create($validatedData);

        // You can add any additional logic or response here if needed
        return response()->json(['message' => 'Demande_conge added successfully', 'data' => $demandeConge], 201);
    }
}
