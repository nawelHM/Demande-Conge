<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Notification; // Add this import
use Illuminate\Http\Response; // Add this import
use App\Notifications\RequestAcceptedNotification;
use App\Notifications\RequestRefusedNotification;
use App\Models\Demande_conges;
use Illuminate\Support\Facades\Log;
use App\Models\UserHistory;
use Illuminate\Support\Facades\DB;

use App\Models\User;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register' ,'update' ,'listUsers', 'changeUserRole' , 'historique','user' , 'getUser' , 'updateUserHistory'  , 'acceptRequest' , 'refuseRequest' ,'updateSoldeaccept' , 'decrementUserSolde']]);
    }
    public function getUserDetailsForDemande($id)
    {
        $demande = Demande_conges::find($id);

        if (!$demande) {
            return response()->json(['error' => 'Demande not found'], Response::HTTP_NOT_FOUND);
        }

        $user = $demande->user; // Assuming there is a relationship between Demande_conges and User

        return response()->json(['user' => $user], Response::HTTP_OK);
    }
    public function register(Request $request)
    {
          $validator = Validator::make($request->all(), [
            'nom' => 'required',
            'prenom' => 'required',
            'email' => 'required|string|email|unique:users', 
            'telephone' => 'required|regex:/^[0-9]{8}$/|unique:users', 
            'departement' => 'required|in:rh,it,reseau,embarque,finance,iot,ai',
            'solde',
            'role' , 
            'password' => 'required|string|confirmed|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create(array_merge(
            $validator->validated(),
            ['password' => bcrypt($request->password)]
        ));

        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user
        ], 201);
        $user = User::create(array_merge(
            $validator->validated(),
            ['password' => bcrypt($request->password), 'solde' => 0.0]
        ));
        
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            
            'email' => 'required|email', 
            'password' => 'required|string|min:8',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        if(!$token=auth()->attempt($validator->validated())){
            return response()->json(['error' => 'Unauthorized'],401);
        }
        return $this->createNewToken($token);
    }


    public function createNewToken($token){
        return response()->json([
            'access_token'=>$token,
            'token_type'=>'bearer',
            'expires_in'=>Auth::factory()->getTTL()*60,
            'user'=>auth()->user()
        ]);
    }

    public function profile(){
        return response()->json(auth()->user());
    }

    public function user()
{
    $user = auth()->user(); // Assuming you're using authentication

    // Debug log to check if the user details are fetched correctly
    //Log::debug('User details:', $user);

    return response()->json($user, 200);
}

public function getUser(Request $request, $userId)
{
    // You can use Eloquent to fetch the user by their ID
    $user = User::find($userId);

    if ($user) {
        return response()->json(['user' => $user]);
    } else {
        return response()->json(['message' => 'User not found'], 404);
    }
}
    public function logout(){
        auth()->logout();
        return response()->json([
            'message' => 'User logged out'
        ]);
   
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required',
            'prenom' => 'required',
            'email' => 'required|string|email|unique:users,email,' . $id,
            'telephone' => 'required|regex:/^[0-9]{8}$/|unique:users,telephone,' . $id,
            'departement' => 'required|in:rh,it,reseau,embarque,finance,iot,ai',
            'solde' => 'numeric',
            'role',
            'password' => 'sometimes|required|string|confirmed|min:8',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }
    
        $user = User::findOrFail($id);
    
        $userData = $validator->validated();
    
        if ($request->has('password')) {
            $userData['password'] = bcrypt($request->password);
        }
    
        $user->update($userData);
    
        return response()->json([
            'message' => 'User successfully updated',
            'user' => $user
        ], 200);
    }
    public function updateSolde(Request $request)
{
    $users = User::all();

    foreach ($users as $user) {
        switch ($user->departement) {
            case 'rh':
                $user->solde += 2;
                break;
            case 'admin':
                $user->solde += 2.2;
                break;
            case 'it':
                $user->solde += 1.83;
                break;
             default:
                 break;
        }
        $user->save();
    }

    return response()->json(['message' => 'solde updated for all users']);
}

public function listUsers()
{
    $users = User::all();

    return response()->json([
        'users' => $users
    ], 200);
}


public function historique()
{
    // Récupérer l'utilisateur authentifié
    $user = auth()->user();

    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    // Récupérer les demandes de congés acceptées pour l'utilisateur authentifié
    $demandesAcceptees = Demande_conges::where('user_id', $user->id)
        ->where('status', 'accepted')
        ->get();

    // Retourner une réponse JSON avec la liste des demandes acceptées
    return response()->json(['historique' => $demandesAcceptees], 200);
}




public function changeUserRole(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'role' => 'required|in:admin,rh,employe', // Add any other roles you have
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors()->toJson(), 400);
    }

    $user = User::findOrFail($id);
    $user->update([
        'role' => $request->role,
    ]);

    return response()->json([
        'message' => 'User role updated successfully',
        'user' => $user,
    ], 200);
}
public function acceptRequest($id)
    {
        
        Log::info('Accept Request Received. Request ID: ' . $id);
        $demande = Demande_conges::findOrFail($id);
        $demande->status = 'accepted';
        $demande->save();

        // Send notification to the user who submitted the request
        Notification::send($demande->user, new RequestAcceptedNotification($demande));

        // Update user history
        $this->updateUserHistory($demande->user_id, $demande->id, 'accepted');

        return response()->json(['message' => 'Request accepted'], 200);
    }

    public function refuseRequest($id)
    {
        Log::info('Refuse Request Received. Request ID: ' . $id);
       
        $demande = Demande_conges::findOrFail($id);
        $demande->status = 'refused';
        $demande->save();

        // Send notification to the user who submitted the request
        Notification::send($demande->user, new RequestRefusedNotification($demande));

        // Update user history
        $this->updateUserHistory($demande->user_id, $demande->id, 'refused');

        return response()->json(['message' => 'Request refused'], 200);
    }

    private function updateUserHistory($userId, $requestId, $status)
{
    Log::info('Updating user history...', [
        'user_id' => $userId,
        'request_id' => $requestId,
        'status' => $status,
    ]);

    $userHistory = new UserHistory([
        'user_id' => $userId,
        'request_id' => $requestId,
        'status' => $status,
        // Other relevant fields
    ]);
    $userHistory->save();

    Log::info('User history updated.');
}



public function updateSoldeaccept(Request $request, $userId)
{
    try {
        $user = User::findOrFail($userId);

        // Extract the amount to update the solde
        $amount = $request->input('amount');

        // Validate that the amount is positive (for increment) or negative (for decrement)
        if ($amount < 0 && $user->solde < abs($amount)) {
            throw new \Exception('Insufficient solde balance.');
        }

        // Update the user's solde
        DB::beginTransaction();

        try {
            $user->solde += $amount;
            $user->save();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw $e;
        }

        return response()->json(['message' => 'Solde updated successfully'], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 400);
    }
}


public function decrementUserSolde(Request $request, $userId, $amount)
{
    // Find the user by ID
    $user = User::find($userId);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Convert the amount to a float
    $amount = (float)$amount;

    // Check if the user has sufficient solde
    if ($user->solde < $amount) {
        return response()->json(['message' => 'Insufficient solde'], 400);
    }

    // Log the user's solde before update
    Log::info("User's solde before update: $user->solde");

    // Decrement the user's solde
    $user->solde -= $amount;
    $user->save();

    // Log the user's solde after update
    Log::info("User's solde after update: $user->solde");

    return response()->json(['message' => 'Solde decremented successfully']);
}
}











