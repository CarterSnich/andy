<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BorrowedBook extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',
        'borrower_id',
        'quantity',
        'is_approved',
        'is_returned',
        'borrowed_date',
        'returned_date'
    ];

    protected $casts = [
        'is_approved'

    ];

    protected $appends = ['book', 'borrower'];

    protected function book(): Attribute
    {
        return Attribute::make(
            get: function () {
                return Book::where('id', $this->book_id)->first();
            }
        );
    }

    protected function borrower(): Attribute
    {
        return Attribute::make(
            get: function () {
                return User::where('id', $this->borrower_id)->first();
            }
        );
    }
}
