<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TodoController;

Route::post('favorite/{id}', [TodoController::class, 'favorite']);
Route::post('completed/{id}', [TodoController::class, 'completed']);
Route::apiResource('todos', TodoController::class);
