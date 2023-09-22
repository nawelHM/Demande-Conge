<?php

namespace App\Http\Controllers;
use App\Models\Comment;
use Illuminate\Http\Request;
use Exception ;
class CommentController extends Controller
{
    public function allcomments()
    {
        $comments = Comment::all();
        return response()->json(['comments' => $comments], 200);
    }
    
    public function ajoutercommentaire(Request $request)
{
    try {
        // Récupérez l'utilisateur authentifié (assurez-vous que l'authentification est configurée correctement).
        $user = auth()->user();

        // Validez les données entrantes (dans ce cas, nous supposons que le commentaire est une chaîne non vide).
        $request->validate([
            'content' => 'required|string',
        ]);

        // Créez un nouveau commentaire associé à l'utilisateur authentifié.
        $commentaire = new Comment();
        $commentaire->user_id = $user->id;
        $commentaire->content = $request->input('content');
        $commentaire->save();

        return response()->json(['commentaire' => $commentaire], 201);
    } catch (Exception $e) {
        // Gérez les erreurs ici (par exemple, enregistrer les erreurs dans les journaux).
        return response()->json(['error' => 'Une erreur est survenue lors de l\'ajout du commentaire'], 500);
    }
}

public function listerCommentaires()
{
    try {
        // Récupérez tous les commentaires de la base de données
        $commentaires = Comment::all();

        // Retournez la liste des commentaires en tant que réponse JSON
        return response()->json(['commentaires' => $commentaires], 200);
    } catch (Exception $e) {
        // Gérez les erreurs ici (par exemple, enregistrer les erreurs dans les journaux).
        return response()->json(['error' => 'Une erreur est survenue lors de la récupération des commentaires'], 500);
    }
}

    public function show(Comment $comment)
    {
        return response()->json(['comment' => $comment], 200);
    }
    
    public function update(Request $request, Comment $comment)
    {
        $comment->update($request->all());
        return response()->json(['comment' => $comment], 200);
    }
    
    public function destroy(Comment $comment)
    {
        $comment->delete();
        return response()->json(['message' => 'Comment deleted'], 204);
    }
    
}
