<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Demande_conges;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class AbsenceReportController extends Controller
{

    public function calculateAbsencesByDepartment()
    {
        $currentMonth = now()->month;
    
        $absencesByDepartment = Cache::remember('absencesData', now()->addMinutes(10), function () use ($currentMonth) {
            return DB::table('users')
                ->leftJoin('demande_conges', 'users.id', '=', 'demande_conges.user_id')
                ->where('demande_conges.status', 'accepted') // Filtrer les demandes approuvées
                ->whereMonth('demande_conges.date_debut', $currentMonth) // Filter by the current month
                ->select('users.departement', 
                    DB::raw('COUNT(demande_conges.id) as total_absences')
                )
                ->groupBy('users.departement')
                ->orderBy('users.departement', 'asc')
                ->get();
        });
    
        return response()->json($absencesByDepartment);
    }
    
    
    public function showAbsencesData()
    {
        $absencesData = Cache::get('absencesData');
    
        // Ajoutez le mois aux données d'absence
        $absencesData['mois'] = date('F'); // 'F' retourne le nom complet du mois en anglais
    
        return response()->json($absencesData);
    }
    

    
}
