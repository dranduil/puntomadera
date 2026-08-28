<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Work;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call(ServiceSeeder::class);

        $portfolioImages = [
            '/images/works/puerta-caoba-regenerada.png',
            ...array_map(
                fn (int $number) => sprintf(
                    '/images/works/punto-madera/punto-madera-%02d.jpg',
                    $number,
                ),
                range(1, 49),
            ),
        ];

        $portfolioAlts = [
            'Puerta de madera color caoba regenerada para portafolio de carpintería en Guayaquil',
            'Puerta de madera oscura con molduras curvas instalada en un interior',
            'Puerta de madera color caoba con paneles decorativos y cerradura metálica',
            'Puerta de madera tallada con diseño clásico y acabado brillante',
            'Puerta de madera oscura con molduras curvas y manija metálica',
            'Puerta negra de madera con molduras instalada junto a una cama',
            'Puerta de madera clara con diseño geométrico instalada en un pasillo',
            'Puerta de madera clara con paneles geométricos vista de frente',
            'Vestidor blanco a medida con puertas abiertas, repisas y cajones',
            'Vestidor blanco a medida con módulos abiertos y barras para ropa',
            'Closet blanco con puertas abiertas, repisas y cajonera lateral',
            'Closet blanco terminado con puertas cerradas y cajones laterales',
            'Mueble auxiliar blanco con dos cajones junto a una cama',
            'Puerta blanca en proceso de instalación con piezas de melamina en el taller',
            'Puerta de madera color caoba instalada en el exterior de una vivienda',
            'Puerta negra de madera con molduras instalada en un dormitorio',
            'Puerta de madera oscura con panel decorativo y cerradura',
            'Puerta de madera clara con líneas geométricas y manija negra',
            'Puerta negra de madera con paneles rectangulares en el taller',
            'Puerta de madera color caoba con diseño geométrico y acabado brillante',
            'Puerta de madera color caoba instalada en un ambiente interior',
            'Closet empotrado de madera color nogal con puertas abiertas',
            'Closet empotrado oscuro con cajones y tiradores metálicos',
            'Mesa de comedor de madera barnizada con sillas tapizadas',
            'Módulo de mueble en MDF sin acabado en el exterior del taller',
            'Dos puertas de madera color caoba listas para instalación',
            'Puerta moderna de madera color nogal con líneas horizontales',
            'Puerta de madera color caoba con paneles decorativos instalada',
            'Mueble de baño en melamina color nogal con lavamanos y cubierta de piedra',
            'Puerta de madera oscura con paneles rectangulares en el taller',
            'Instalación de puerta negra de madera en una vivienda',
            'Puerta interior de madera color caoba instalada en un ambiente',
            'Instalación de puerta negra con líneas decorativas en una habitación',
            'Puerta color caoba abierta entre ambientes interiores',
            'Closet de madera clara a medida con puertas abiertas y cajones',
            'Dos puertas negras interiores con diseño de líneas decorativas',
            'Puerta principal azul oscuro con paneles decorativos y herrajes',
            'Puerta de madera color vino con molduras curvas en el taller',
            'Closet de madera clara a medida con módulos abiertos y cajones',
            'Dos puertas interiores negras con diseño de líneas metálicas',
            'Puerta principal azul oscuro con paneles y manija ornamental',
            'Puerta de madera color caoba con moldura curva en exhibición',
            'Puertas de madera barnizada en proceso de fabricación en el taller',
            'Puerta de madera oscura con molduras clásicas en proceso de acabado',
            'Puerta de madera color caoba barnizada sobre una mesa de trabajo',
            'Puerta de madera con molduras clásicas y acabado brillante sobre mesa',
            'Puerta de madera clara con paneles decorativos en el taller',
            'Cómoda de madera oscura con cajones de diseño moderno',
            'Puerta de madera con molduras curvas y acabado caoba',
            'Puertas blancas y paneles de melamina en proceso de instalación',
        ];

        $portfolioImageChunks = array_chunk($portfolioImages, 14);
        $portfolioAltChunks = array_chunk($portfolioAlts, 14);
        $portfolioWorks = [
            [
                'title' => 'Puertas de madera personalizadas',
                'slug' => 'puertas-madera-personalizadas-guayaquil',
                'description' => 'Puertas de madera fabricadas, restauradas e instaladas para hogares de Guayaquil.',
            ],
            [
                'title' => 'Closets y muebles a medida',
                'slug' => 'closets-muebles-medida-guayaquil',
                'description' => 'Closets, cajoneras y muebles a medida diseñados para aprovechar cada espacio.',
            ],
            [
                'title' => 'Muebles y puertas terminadas',
                'slug' => 'muebles-puertas-terminadas-guayaquil',
                'description' => 'Selección de muebles, puertas y trabajos de carpintería terminados.',
            ],
            [
                'title' => 'Carpintería artesanal y acabados',
                'slug' => 'carpinteria-artesanal-acabados-guayaquil',
                'description' => 'Detalles de fabricación, barnizado y acabados realizados en nuestro taller.',
            ],
        ];

        foreach ($portfolioWorks as $index => $work) {
            Work::query()->updateOrCreate(
                ['slug' => $work['slug']],
                [
                    ...$work,
                    'location' => 'Guayaquil, Ecuador',
                    'images' => $portfolioImageChunks[$index] ?? [],
                    'image_alts' => $portfolioAltChunks[$index] ?? [],
                    'is_published' => true,
                ],
            );
        }
    }
}
