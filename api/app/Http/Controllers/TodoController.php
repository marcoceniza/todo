<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $todos = Todo::latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Fetch Successfully.',
            'result' => $todos
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|min:4'
        ]);

        Todo::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Created Successfully.'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Todo $todo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Todo $todo)
    {
        $validated = $request->validate([
            'title' => 'required|min:4'
        ]);

        $todo->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Updated Successfully.'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $todo = Todo::findOrFail($id);
        $todo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Deleted Successfully.'
        ]);
    }

    /**
     * Set todo as favorite.
     */
    public function favorite($id)
    {
        $todo = Todo::findOrFail($id);

        $todo->favorite = $todo->favorite === 1 ? 0 : 1;
        $todo->created_at = now();
        $todo->save();

        return response()->json([
            'success' => true,
            'message' => $todo->favorite === 1 ? 'Todo set to Favorite.' : 'Todo removed from Favorites.'
        ]);
    }

    /**
     * Set todo as completed.
     */
    public function completed($id)
    {
        $todo = Todo::findOrFail($id);

        $todo->completed = $todo->completed === 1 ? 0 : 1;
        $todo->favorite = 0;
        $todo->created_at = now();
        $todo->save();

        return response()->json([
            'success' => true,
            'message' => $todo->completed === 1 ? 'Todo set to Completed.' : 'Todo removed from Completed.'
        ]);
    }
}
