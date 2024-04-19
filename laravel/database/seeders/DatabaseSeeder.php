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
            'firstname' => 'La Rhaine',
            'lastname' => 'Rabino',
            'id_number' => '2954534',
            'password' => Hash::make('password'),
            'email' => 'librarian@example.com',
            'type' => 'librarian',
            'contact' => '09212734764'
        ]);

        \App\Models\User::factory()->create([
            'firstname' => 'Andy',
            'lastname' => 'Ragana',
            'id_number' => '8494156',
            'password' => Hash::make('password'),
            'email' => 'borrower@example.com',
            'type' => 'borrower',
            'contact' => '09562818189'
        ]);

        \App\Models\User::factory()->create([
            'firstname' => 'John',
            'lastname' => 'de la Cruz',
            'id_number' => '1619185',
            'password' => Hash::make('password'),
            'email' => 'aide@example.com',
            'type' => 'librarian-aide',
            'contact' => '09123456789'
        ]);


        $faker = fake();

        for ($i = 0; $i < 10; $i++) {
            \App\Models\Book::factory()->create([
                'isbn' => $faker->isbn13(),
                'title' => $faker->words(asText: true),
                'author' => $faker->name(),
                'publisher' => $faker->lastName() . " Publishing",
                'quantity' => $faker->numberBetween(0, 100),
                'price' => $faker->numberBetween(100, 100000)
            ]);
        }
    }
}
