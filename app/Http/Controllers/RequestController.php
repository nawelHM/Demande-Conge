<?php

namespace App\Http\Controllers;

use App\Models\Demande_conges;
use App\Models\UserHistory;
use App\Notifications\RequestAcceptedNotification;
use App\Notifications\RequestRefusedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class RequestController extends Controller
{
    /*  public function acceptRequest($requestId)
    {
        try {
            // Enable query logging
            DB::connection()->enableQueryLog();
    
            // Fetch the request
            $request = Demande_conges::findOrFail($requestId);
    
            // Log: Accept request received
            Log::info("Accept Request Received. Request ID: $requestId");
    
            // Update the request status to "accepted"
            $request->update(['status' => 'accepted']);
    
            // Log: Request status updated
            Log::info('Request status updated to "accepted".');
    
            // Calculate the duration of the leave request in days
            $startDate = $request->date_debut;
            $endDate = $request->date_fin;
            $durationInDays = $startDate->diffInDays($endDate) + 1; // Including both start and end dates
    
            // Adjust the duration for requests less than one day
            if ($durationInDays < 1) {
                $durationInDays = 0.5; // If less than a day, set it to 0.5 day
            }
    
            // Log: Duration calculated
            Log::info("Duration in days: $durationInDays");
    
            // Update user's balance
            $user = $request->user; // Assuming there's a relationship between Demande_conges and User
    
            // Log: User balance before update
            Log::info("User balance before update: {$user->solde}");
    
            $user->solde -= $durationInDays;
    
            // Log: User balance after decrement
            Log::info("User balance after decrement: {$user->solde}");
    
            $user->save();
    
            // Log: User balance after update
            Log::info("User balance after update: {$user->solde}");
    
            // Send the notification to the user who submitted the request
            $user->notify(new RequestAcceptedNotification($request)); // Pass the request to the notification
    
            // Log: Notification sent
            Log::info('Notification sent to the user.');
    
            // Get the query log
            $queryLog = DB::getQueryLog();
    
            // Log the query log
            Log::info(print_r($queryLog, true));
    
            // ... Other logic ...
    
        } catch (Exception $e) {
            // Log: Exception occurred
            Log::error('Exception in acceptRequest: ' . $e->getMessage());
            // Rethrow the exception if needed
            throw $e;
        }
    } */




    /* public function acceptRequest($requestId)
    {
        try {
            // Find the request
            $request = Demande_conges::findOrFail($requestId);
            Log::info("Accept Request Received. Request ID: $requestId");

            // Ensure the request is pending before accepting
            if ($request->status !== 'pending') {
                throw new \Exception('Request is not in pending status.');
            }
            Log::info("Request ID $requestId is in pending status.");

            // Calculate the duration of the leave request in days
            $durationInDays = $request->calculateDurationInDays();
            Log::info("Duration of request ID $requestId: $durationInDays days");

            // Find the user
            $user = $request->user;

            // Log the user's solde before the update
            Log::info("User's solde before update for request ID $requestId: " . $user->solde);

            // Check if the user's solde (balance) is sufficient for the request
            if ($user->solde >= $durationInDays) {
                // Start a database transaction
                DB::beginTransaction();

                try {
                    // Update the request status to "accepted"
                    $request->update(['status' => 'accepted']);
                    Log::info("Request ID $requestId has been accepted.");

                    // Update user's solde (balance)
                    $user->solde -= $durationInDays;

                    // Save the user model to update the balance
                    $user->save();

                    // Commit the database transaction
                    DB::commit();

                    // Log the updated solde
                    Log::info("User's solde after update for request ID $requestId: " . $user->solde);

                    // Send notification
                    $user->notify(new RequestAcceptedNotification($request));
                    Log::info("Notification sent for request ID $requestId.");
                } catch (Exception $e) {
                    // Rollback the transaction on error
                    DB::rollback();
                    Log::error('Exception during acceptRequest: ' . $e->getMessage());
                    throw $e;
                }
            } else {
                // If the solde is insufficient, deliver a message
                Log::info("Solde balance is insufficient for request ID $requestId. Not enough solde.");
                // You can handle the delivery of the message here as needed.
            }
        } catch (Exception $e) {
            // Log and handle exceptions
            Log::error('Exception in acceptRequest: ' . $e->getMessage());
            throw $e;
        }
    }



    public function refuseRequest($requestId)

    {
        // Fetch the request

        $request = Demande_conges::findOrFail($requestId);

        // Update the request status to "refused"
        $request->update(['status' => 'refused']);

        // Send the notification to the user who submitted the request
        $user = $request->user; // Assuming there's a relationship between Demande_conges and User
        $user->notify(new RequestRefusedNotification($request)); // Pass the request to the notification

        // ... Other logic ...
    } */

    public function acceptRequest($requestId)
    {
        try {
            $request = Demande_conges::findOrFail($requestId);
            Log::info("Accept Request Received. Request ID: $requestId");

            if ($request->status !== 'pending') {
                throw new \Exception('Request is not in pending status.');
            }
            Log::info("Request ID $requestId is in pending status.");

            $durationInDays = $request->calculateDurationInDays();
            Log::info("Duration of request ID $requestId: $durationInDays days");

            $user = $request->user;

            Log::info("User's solde before update for request ID $requestId: " . $user->solde);

            if ($user->solde >= $durationInDays) {
                DB::beginTransaction();

                try {
                    $request->update(['status' => 'accepted']);
                    Log::info("Request ID $requestId has been accepted.");

                    $user->solde -= $durationInDays;
                    $user->save();

                    DB::commit();

                    Log::info("User's solde after update for request ID $requestId: " . $user->solde);

                    $user->notify(new RequestAcceptedNotification($request));
                    Log::info("Notification sent for request ID $requestId.");
                } catch (Exception $e) {
                    DB::rollback();
                    Log::error('Exception during acceptRequest: ' . $e->getMessage());
                    throw $e;
                }
            } else {
                Log::info("Solde balance is insufficient for request ID $requestId. Not enough solde.");
                // Handle the case where the balance is insufficient here.
            }
        } catch (Exception $e) {
            Log::error('Exception in acceptRequest: ' . $e->getMessage());
            throw $e;
        }
    }

    public function refuseRequest($requestId)
    {
        try {
            $request = Demande_conges::findOrFail($requestId);
            $request->update(['status' => 'refused']);

            $user = $request->user;
            $user->notify(new RequestRefusedNotification($request));

            // Handle other logic as needed.

        } catch (Exception $e) {
            Log::error('Exception in refuseRequest: ' . $e->getMessage());
            throw $e;
        }
    }





    public function getUserNotifications($userId)
    {
        $notifications = UserHistory::where('user_id', $userId)->orderBy('created_at', 'desc')->get();

        $formattedNotifications = $notifications->map(function ($notification) {
            return [
                'message' => $this->getMessageForStatus($notification->status),
                'status' => $notification->status,
            ];
        });

        return response()->json($formattedNotifications);
    }

    private function getMessageForStatus($status)
    {
        if ($status === 'accepted') {
            return __('Félicitations ! Votre demande de congé a été acceptée.'); // Replace with your translation key
        } else {
            return __('Nous sommes désolés, mais votre demande de congé a été refusée. Vous pouvez contacter le service des ressources humaines pour plus de détails.'); // Replace with your translation key
        }
    }
}
