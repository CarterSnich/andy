<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();


        \App\Models\User::factory()->create([
            'name' => 'La Rhaine Rabino',
            'id_number' => '295340',
            'password' => Hash::make('password'),
            'email' => 'librarian@example.com',
            'type' => 'librarian',
            'contact' => '0921273476'
        ]);

        \App\Models\User::factory()->create([
            'name' => 'Andy Ragana',
            'id_number' => '849156',
            'password' => Hash::make('password'),
            'email' => 'borrower@example.com',
            'type' => 'borrower',
            'contact' => '0921273476'
        ]);

        \App\Models\User::factory()->create([
            'name' => 'John de la Cruz',
            'id_number' => '161918',
            'password' => Hash::make('password'),
            'email' => 'aide@example.com',
            'type' => 'librarian-aide',
            'contact' => '0921273476'
        ]);

        \App\Models\Book::factory()->create([
            'isbn' => fake()->isbn13(),
            'title' => 'The Book',
            'author' => 'Sherlock',
            'publisher' => 'The Pub',
            'quantity' => 500,
            'price' => 1111
        ]);
    }
}
