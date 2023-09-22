<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\CustomNotification;
use Illuminate\Notifications\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Exception;
class NotificationController extends Controller
{
    public function AllNotification()
    {
        $user = Auth::user(); // Assuming you're using authentication
        $notifications = $user->notifications;

        return response()->json(['notifications' => $notifications], 200);
    }
    public function markAsRead($id)
    {
        $notification = CustomNotification::find($id);

        if ($notification) {
            $notification->markAsRead();
            return response()->json(['message' => 'Notification marked as read'], 200);
        } else {
            return response()->json(['message' => 'Notification not found'], 404);
        }
    }

    public function getNotificationTypes($notificationId)
    {
        // Retrieve the specific notification by ID
        $notification = CustomNotification::find($notificationId);

        if (!$notification) {
            return response()->json(['error' => 'Notification not found'], 404);
        }

        // Retrieve the notification type
        $notificationType = $notification->type;

        return response()->json(['notification_type' => $notificationType]);
    }



    /* public function markAsRead(Request $request, $notificationId)
{
    $user = Auth::user();
    $notification = $user->notifications()->find($notificationId);

    if (!$notification) {
        return response()->json(['message' => 'Notification not found'], 404);
    }

    // Check if the notification is already marked as read
    if (!$notification->read_at) {
        // Mark the notification as read and update the 'read_at' timestamp
        $notification->markAsRead();
    }

    return response()->json(['message' => 'Notification marked as read'], 200);
}
 */
public function unreadCount(Request $request)
{
   
    if ($request->user()) {
        $user = $request->user();
        $count = $user->unreadNotifications->count();
        return response()->json(['unread_count' => $count]);
    } else {
        return response()->json(['error' => 'User is not authenticated'], 401);
    }
}






    /* public function unreadCount(Request $request)
{
    // Check if the user is authenticated
    if ($request->user()) {
        $user = $request->user();
        $role = $user->role; // Assuming you have a 'role' attribute on the User model
        
        $unreadCount = 0;

        if ($role === 'employee') {
            // Calculate the count of unread notifications related to leave requests for employees
            $unreadCount = $user->unreadNotifications
                ->where('type', 'App\Notifications\LeaveRequestNotification') // Adjust the notification type according to your setup
                ->count();
        } elseif ($role === 'HR' || $role === 'admin') {
            // Calculate the count of unread notifications for HR and admin
            $unreadCount = $user->unreadNotifications->count();
        }

        return response()->json(['unread_count' => $unreadCount]);
    } else {
        return response()->json(['error' => 'User is not authenticated'], 401);
    }
} */



    /* public function unreadCount(Request $request)
    {
        // Check if the user is authenticated
        if ($request->user()) {
            $user = $request->user();
            $role = $user->role; // Assuming you have a 'role' attribute on the User model

            $unreadCount = 0;

            if  ($role === 'HR' || $role === 'admin') {
                // Calculate the count of unread notifications for HR and admin
                $unreadCount = $user->unreadNotifications->count();
            }

            return response()->json(['unread_count' => $unreadCount]);
        } else {
            return response()->json(['error' => 'User is not authenticated'], 401);
        }

        
    } */


     public function unreadEmployeeCount(Request $request)

    {
        // Check if the user is authenticated
        if ($request->user()) {
            $user = $request->user();
            $role = $user->role; // Assuming you have a 'role' attribute on the User model
    
            $unreadCount = 0;
    
            if ($role === 'employee') {
                // Calculate the count of unread notifications for employees
                $unreadCount = $user->unreadNotifications->count();
            }
    
            return response()->json(['unread_count' => $unreadCount]);
        } else {
            return response()->json(['error' => 'User is not authenticated'], 401);
        }
    }
    


   /*  public function unreadEmployeeCount(Request $request)
    {
        try {
            // Check if the user is authenticated and has the role of an employee
            $user = $request->user();
            if ($user && $user->role === 'employe') {
                // Count unread notifications of types RequestRefusedNotification and RequestAcceptedNotification
                $unreadCount = $user->unreadNotifications
                    ->whereIn('type', ['App\Notifications\RequestRefusedNotification', 'App\Notifications\RequestAcceptedNotification'])
                    ->count();

                return response()->json(['unread_count' => $unreadCount]);
            } else {
                return response()->json(['error' => 'User is not authenticated or is not an employee'], 401);
            }
        } catch (Exception $e) {
            Log::error('Exception in unreadEmployeeCount: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while counting unread notifications'], 500);
        }
    } */


    



    public function countAllNotification()
    {
        // Determine the roles for which you want to count notifications
        $targetRoles = ['admin', 'rh'];

        // Query users with the specified roles
        $usersWithRoles = User::whereIn('role', $targetRoles)->get();

        // Initialize a counter for the total number of notifications
        $totalNotifications = 0;

        // Loop through each user and count their notifications
        foreach ($usersWithRoles as $user) {
            $totalNotifications += $user->notifications->count();
        }

        return response()->json(['total_notifications' => $totalNotifications], 200);
    }

    public function unreadCountByRole(Request $request)
    {
        // Get the authenticated user
        $user = auth()->user();

        // Determine the role of the authenticated user
        $role = $user->role;

        // Initialize a counter for the total number of unread notifications
        $totalUnreadNotifications = 0;

        // Query users with the specified role
        $usersWithRole = User::where('role', $role)->get();

        // Loop through each user and count their unread notifications
        foreach ($usersWithRole as $user) {
            $totalUnreadNotifications += $user->unreadNotifications->count();
        }

        return response()->json(['unread_count' => $totalUnreadNotifications], 200);
    }
}
