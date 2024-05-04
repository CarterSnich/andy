<?php

use App\Models\Book;
use App\Models\BorrowedBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Symfony\Component\CssSelector\Node\FunctionNode;

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

Route::middleware('auth:sanctum')->get('/auth/validate-token', function () {
    return ['data' => true];
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

    if ($user->is_deactivated) {
        abort(401, 'Unauthorized access.');
    }

    return json_encode([
        'access_token' => $user->createToken($request->email)->plainTextToken
    ]);
});

Route::middleware('auth:sanctum')->delete('/auth/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
});

Route::post('/users/add', function (Request $request) {
    $new_user = $request->validate([
        'firstname' => [
            'required',
            'regex:/^[a-zA-Z]+(?:-[a-zA-Z]+)*(?:\s[a-zA-Z]+(?:-[a-zA-Z]+)*)*$/'
        ],
        'lastname' => [
            'required',
            'regex:/^[a-zA-Z]+(?:-[a-zA-Z]+)*(?:\s[a-zA-Z]+(?:-[a-zA-Z]+)*)*$/'
        ],
        'id_number' => ['required', 'size:7', 'unique:users'],
        'email' => [
            'required',
            'regex:/^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
            'unique:users'
        ],
        'password' => 'required',
        'type' => [
            'required',
            Rule::in(['librarian', 'borrower', 'librarian-aide']),
        ],
        'contact' => [
            'required',
            'regex:/^(09)\d{9}$/',
            'unique:users'
        ]
    ]);
    $new_user['password'] = Hash::make($request->password);
    User::create($new_user);
});

Route::put('/users/{id_number}/update', function (Request $request, string $id_number) {
    $request->validate([
        'firstname' => [
            'required',
            'regex:/^[a-zA-Z]+(?:-[a-zA-Z]+)*(?:\s[a-zA-Z]+(?:-[a-zA-Z]+)*)*$/'
        ],
        'lastname' => [
            'required',
            'regex:/^[a-zA-Z]+(?:-[a-zA-Z]+)*(?:\s[a-zA-Z]+(?:-[a-zA-Z]+)*)*$/'
        ],
        'id_number' => [
            'required',
            'size:7',
            Rule::unique('users')->ignore($id_number, 'id_number'),
        ],
        'email' => [
            'required',
            'regex:/^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
            Rule::unique('users')->ignore($id_number, 'id_number'),
        ],
        'password' => ['sometimes', 'required'],
        'type' => [
            'required',
            Rule::in(['librarian', 'borrower', 'librarian-aide']),
        ],
        'contact' => [
            'required',
            'regex:/^(09)\d{9}$/',
            Rule::unique('users')->ignore($id_number, 'id_number'),
        ]
    ]);

    if ($user = User::where('id_number', $id_number)->first()) {
        $user->firstname = $request->firstname;
        $user->lastname = $request->lastname;
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

Route::put('/users/{id_number}/activation', function (Request $request, string $id_number) {
    if ($user = User::where('id_number', $id_number)->first()) {
        $user->is_deactivated = $request->activation;
        $user->save();
    } else {
        abort(404, 'User not found.');
    }
});

Route::get('/users', function (Request $request) {
    $keyword = $request->get('query');
    if ($keyword) {
        return User::where(function ($query) use ($keyword) {
            $query
                ->where('firstname', 'like', '%' . $keyword . '%')
                ->orWhere('lastname', 'like', '%' . $keyword . '%')
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
            $query
                ->where('isbn', 'like', '%' . $keyword . '%')
                ->orWhere('title', 'like', '%' . $keyword . '%')
                ->orWhere('author', 'like', '%' . $keyword . '%')
                ->orWhere('publisher', 'like', '%' . $keyword . '%');
        })->orderBy('author')->paginate(20);
    } else {
        return Book::orderBy('author')->paginate(20);
    }
});

Route::post('books/add', function (Request $request) {

    $new_book = $request->validate([
        'title' => 'required',
        'author' => 'required',
        'publisher' => 'required',
        'quantity' => 'required',
        'price' => ['required', 'numeric']
    ]);

    if ($existing_book = Book::where('title', $new_book['title'])
        ->where('author', $new_book['author'])
        ->where('publisher', $new_book['publisher'])
        ->first()
    ) {
        $existing_book->quantity = $existing_book->quantity + 1;
        $existing_book->save();
        return;
    }

    $new_book['isbn'] = fake()->isbn13();

    Book::create($new_book);
});

Route::put('books/{id}/deletion', function (Request $request, string $id) {
    if ($book = Book::where('id', $id)->first()) {
        $book->is_deleted = $request->deletion;
        $book->save();
    } else {
        abort(404, 'Book not found.');
    }
});

Route::put('books/{id}/update', function (Request $request, string $id) {
    $request->validate([
        'title' => 'required',
        'author' => 'required',
        'publisher' => 'required',
        'quantity' => ['required', 'numeric'],
        'price' => ['required', 'numeric']
    ]);

    if ($book = Book::where('id', $id)->first()) {
        $book->title = $request->title;
        $book->author = $request->author;
        $book->publisher = $request->publisher;
        $book->quantity = $request->quantity;
        $book->price = $request->price;
        $book->save();
    } else {
        abort(404, 'Book not found.');
    }
});

Route::get('/auth/user-profile', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('borrowed-books', function () {
    return BorrowedBook::all();
})->middleware('auth:sanctum');

Route::post('/borrowed-books/borrow/{book}', function (Request $request, Book $book) {
    $book_id = $book->id;
    $borrower_id = $request->user()->id;

    BorrowedBook::create([
        'book_id' => $book_id,
        'borrower_id' => $borrower_id,
    ]);
})->middleware('auth:sanctum');

Route::patch('borrowed-books/{borrowed_book}/approve', function (Request $request, BorrowedBook $borrowed_book) {
    $borrowed_book->is_approved = true;
    $borrowed_book->save();
})->middleware('auth:sanctum');
