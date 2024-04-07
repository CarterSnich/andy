<?php

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;


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
        'email' => ['required', 'email'],
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
    $request->validate([
        'name' => 'required',
        'id_number' => ['required', 'unique:users'],
        'email' => ['required', 'email', 'unique:users'],
        'password' => 'required',
        'type' => [
            'required',
            Rule::in(['librarian', 'borrower', 'librarian-aide']),
        ],
        'contact' => 'required'
    ]);
    $new_user = $request->all();
    $new_user['password'] = Hash::make($request->password);
    User::create($new_user);
});

Route::put('/users/{id_number}/update', function (Request $request, string $id_number) {
    $request->validate([
        'name' => 'required',
        'id_number' => ['required', 'unique:users'],
        'email' => ['required', 'email', 'unique:users'],
        'password' => ['sometimes', 'required'],
        'type' => [
            'required',
            Rule::in(['librarian', 'borrower', 'librarian-aide']),
        ],
        'contact' => 'required'
    ]);

    if ($user = User::where('id_number', $id_number)->first()) {
        $user->name = $request->name;
        $user->id_number = $request->id_number;
        $user->email = $request->email;
        if ($request->password) {
            $user->password = Hash::make($request->password);
        }
        $user->type = $request->type;
        $user->contact = $request->contact;
        $user->save();
    } else {
        abort(404, 'User not found.');
    }
});

Route::delete('/users/{id_number}/delete', function (string $id_number) {
    if ($user = User::where('id_number', $id_number)->first()) {
        $user->delete();
    } else {
        abort(404, 'User not found.');
    }
});

Route::get('/users', function (Request $request) {
    $keyword = $request->get('query');
    if ($keyword) {
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

Route::get('books', function (Request $request) {
    $keyword = $request->get('query');
    if ($keyword) {
        return Book::where(function ($query) use ($keyword) {
            $query->where('isbn', 'like', '%' . $keyword . '%')
                ->orWhere('title', 'like', '%' . $keyword . '%')
                ->orWhere('author', 'like', '%' . $keyword . '%')
                ->orWhere('publisher', 'like', '%' . $keyword . '%');
        })->get();
    } else {
        return Book::all();
    }
});

Route::post('books/add', function (Request $request) {
    $request->validate([
        'title' => 'required',
        'author' => 'required',
        'publisher' => 'required',
        'price' => ['required', 'numeric']
    ]);

    $newBook = $request->all();
    $newBook['isbn'] = fake()->isbn13();
    Book::create($newBook);
});

Route::delete('books/{id}/delete', function (string $id) {
    if ($book = Book::where('id', $id)) {
        $book->delete();
    } else {
        abort(404, 'Book not found.');
    }
});

Route::put('books/{id}/update', function (Request $request, string $id) {
    $request->validate([
        'title' => 'required',
        'author' => 'required',
        'publisher' => 'required',
        'price' => ['required', 'numeric']
    ]);

    if ($book = Book::where('id', $id)) {
        $book->update($request->all());
    } else {
        abort(404, 'Book not found.');
    }
});

Route::get('/auth/user-profile', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
