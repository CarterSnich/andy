<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/auth/login', function (Request $request) {

    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    return json_encode([
        'access_token' => $user->createToken($request->email)->plainTextToken
    ]);
});


Route::post('/users/add', function (Request $request) {
    $new_user = $request->all();
    $new_user['password'] = Hash::make($request->password);
    User::create($new_user);
});

Route::put('/users/{id_number}/update', function (Request $request, string $id_number) {
    $user = User::where('id_number', $id_number)->first();
    $user->name = $request->name;
    $user->id_number = $request->id_number;
    $user->email = $request->email;
    error_log($request->password);
    if ($request->password) {
        $user->password = Hash::make($request->password);
    }
    $user->type = $request->type;
    $user->contact = $request->contact;
    $user->save();
});

Route::delete('/users/{id_number}/delete', function (string $id_number) {
    User::where('id_number', $id_number)->delete();
});

Route::get('/users', function (Request $request) {

    $keyword = $request->get('query');
    if ($keyword) {
        error_log($keyword);
        return User::where(function ($query) use ($keyword) {
            $query->where('name', 'like', '%' . $keyword . '%')
                ->orWhere('id_number', 'like', '%' . $keyword . '%')
                ->orWhere('contact', 'like', '%' . $keyword . '%')
                ->orWhere('type', 'like', '%' . $keyword . '%')
                ->orWhere('email', 'like', '%' . $keyword . '%');
        })->get();
    } else {
        return User::all();
    }
});

Route::get('/auth/user-profile', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
