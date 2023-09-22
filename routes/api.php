<?php
use App\Http\Controllers\NotificationController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DemandeCongeController;
use App\Http\Controllers\DemandeCongesController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\AbsenceReportController;
use App\Http\Controllers\CommentController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group(['middelware'=>'api','prefix'=>'auth'] , function($router){
    Route::post('/register' , [AuthController::class,'register']);
    Route::post('/login' , [AuthController::class,'login']);
    Route::get('/profile' , [AuthController::class,'profile']);
    
    Route::get('/user' , [AuthController::class,'user']);
    

    Route::post('/updateSoldeaccept/{userId}', [AuthController::class,'updateSoldeaccept']);
    Route::post('/logout' , [AuthController::class,'logout']);
    Route::post('/updateSolde', [AuthController::class,'updateSolde']);
    Route::post('/demandeconge', [DemandeCongeController::class,'demandeconge']);
    Route::post('/store', [DemandeCongesController::class,'store']);
    Route::put('/update/{id}', [AuthController::class,'update']);
    Route::get('/getUserDetailsForDemande/{id}', [AuthController::class,'getUserDetailsForDemande']);
   
    Route::get('/getDemandesByUserId/{userId}', [DemandeCongesController::class,'getDemandesByUserId']);
    Route::get('/getDemandeByNotificationId/{notificationId}', [DemandeCongesController::class,'getDemandeByNotificationId']);
    
    Route::get('/index' , [DemandeCongesController::class,'index']);
   // ($notificationId)
    Route::get('/lister' , [DemandeCongesController::class,'lister']);
    Route::get('/Demande' , [DemandeCongesController::class,'Demande']);
    Route::get('/listUsers' , [AuthController::class,'listUsers']);
    Route::put('/changeUserRole/{id}', [AuthController::class,'changeUserRole']);
    Route::get('/historique' , [AuthController::class,'historique']);
    Route::get('/unreadNotifications' , [NotificationController::class,'unreadNotifications']);
    Route::get('/unreadNotifications', [NotificationController::class, 'unreadNotifications']);
    Route::get('/getUser/{userId}', [AuthController::class, 'getUser']);
    Route::get('/getUserNotifications/{userId}', [RequestController::class, 'getUserNotifications']);
    
    Route::put('/markAsUnread/{id}', [NotificationController::class,'markAsUnread']);
    Route::get('/AllNotification', [NotificationController::class, 'AllNotification']);
    Route::get('/unreadCount', [NotificationController::class, 'unreadCount']);
    Route::get('/countAllNotification', [NotificationController::class, 'countAllNotification']);
    Route::get('/getNotificationTypes/{notificationid}', [NotificationController::class, 'getNotificationTypes']);
    
    Route::get('/showAbsencesData', [AbsenceReportController::class, 'showAbsencesData']);
    
    Route::put('/acceptRequest/{id}', [AuthController::class, 'acceptRequest']);

    // Route for refusing a request
    Route::put('/refuseRequest/{id}', [AuthController::class, 'refuseRequest']);
    Route::get('/calculateAbsencesByDepartment', [AbsenceReportController::class, 'calculateAbsencesByDepartment']);
    
    Route::post('/markAsRead/{id}', [NotificationController::class,'markAsRead']);
    Route::get('/unreadCount', [NotificationController::class, 'unreadCount']);
    Route::get('/unreadCountByRole', [NotificationController::class, 'unreadCountByRole']);
    Route::put('/decrementUserSolde/{userId}/{amount}', [AuthController::class, 'decrementUserSolde']);

    
    Route::get('/absence-report', [AbsenceReportController::class, 'calculateAbsencesByDepartment']);
    Route::get('/markNotificationAsRead/{notification}', [NotificationController::class,'markNotificationAsRead']);
    Route::get('/updateSolde', [AuthController::class, 'updateSolde']);
    Route::get('/allcomments', [CommentController::class, 'allcommentes']);
    Route::post('/ajoutercommentaire', [CommentController::class, 'ajoutercommentaire']);
    Route::get('/update/{comment}', [CommentController::class, 'update']);
    Route::get('/destroy/{comment}', [CommentController::class, 'destroy']);
    
    Route::get('/listerCommentaires', [CommentController::class, 'listerCommentaires']);
    Route::get('/unreadEmployeeCount', [NotificationController::class,'unreadEmployeeCount']);
   
    
});
