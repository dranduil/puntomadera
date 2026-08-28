<?php

use App\Models\Work;
use Inertia\Testing\AssertableInertia as Assert;

test('public works include Spanish alt text for every gallery image', function () {
    Work::query()->create([
        'title' => 'Puertas de madera personalizadas',
        'slug' => 'puertas-de-madera-personalizadas',
        'location' => 'Guayaquil, Ecuador',
        'images' => [
            '/images/works/punto-madera/punto-madera-01.jpg',
            '/images/works/punto-madera/punto-madera-02.jpg',
        ],
        'image_alts' => [
            'Puerta de madera oscura instalada en un interior',
            'Puerta de madera color caoba con paneles decorativos',
        ],
        'is_published' => true,
    ]);

    $this->get(route('works.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('works/index')
            ->where('works.data.0.image_alts', [
                'Puerta de madera oscura instalada en un interior',
                'Puerta de madera color caoba con paneles decorativos',
            ]),
        );
});
