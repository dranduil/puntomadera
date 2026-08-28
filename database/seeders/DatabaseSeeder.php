<?php

namespace Database\Seeders;

use App\Models\Service;
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

        $services = [
            [
                'name' => 'Carpintero a domicilio en Guayaquil',
                'slug' => 'carpintero-a-domicilio-guayaquil',
                'summary' => 'Servicio de carpinteria a domicilio en Guayaquil para muebles, puertas y reparaciones con visita tecnica.',
                'description' => "Atendemos servicio de carpinteria a domicilio en Guayaquil y zonas cercanas. Realizamos levantamiento de medidas, recomendacion de materiales y ejecucion prolija para hogar o negocio.\n\nIdeal para quien busca carpintero en Guayaquil con atencion rapida, cotizacion clara y seguimiento por WhatsApp.",
                'process_steps' => [
                    'Visita tecnica en Guayaquil para revisar espacio y requerimientos.',
                    'Propuesta con materiales, tiempos y presupuesto.',
                    'Fabricacion, instalacion y control final de calidad.',
                ],
                'default_message' => 'Hola, quiero cotizar servicio de carpintero a domicilio en Guayaquil. Comparto medidas, fotos y ubicacion.',
                'image_path' => 'images/works/service06.jpg',
                'is_published' => true,
            ],
            [
                'name' => 'Muebles a medida en Guayaquil',
                'slug' => 'muebles-a-medida-guayaquil',
                'summary' => 'Diseno y fabricacion de muebles a medida en Guayaquil para sala, dormitorio, oficina y espacios pequenos.',
                'description' => "Fabricamos muebles a medida en Guayaquil con enfoque funcional y acabado fino. Trabajamos melamina, MDF y madera segun uso del ambiente, presupuesto y estilo.\n\nOptimizamos distribucion para departamentos, casas y locales comerciales, priorizando durabilidad y facil mantenimiento.",
                'process_steps' => [
                    'Definicion de estilo, medidas y uso del mueble.',
                    'Diseno tecnico y seleccion de material segun presupuesto.',
                    'Fabricacion, entrega e instalacion en sitio.',
                ],
                'default_message' => 'Hola, deseo cotizar muebles a medida en Guayaquil. Tengo referencias, medidas y fotos del espacio.',
                'image_path' => 'images/works/service01.jpg',
                'is_published' => true,
            ],
            [
                'name' => 'Closets y anaqueles de cocina en Guayaquil',
                'slug' => 'closets-anaqueles-cocina-guayaquil',
                'summary' => 'Fabricacion e instalacion de closets y anaqueles de cocina en Guayaquil con diseno personalizado.',
                'description' => "Desarrollamos closets empotrados y anaqueles de cocina en Guayaquil, adaptados a dimensiones reales y flujo diario de uso. Disenamos interiores para maximizar orden, capacidad y accesibilidad.\n\nServicio pensado para remodelaciones y proyectos nuevos con acompanamiento completo desde diseno hasta instalacion.",
                'process_steps' => [
                    'Medicion del area, definicion de distribucion interior y frentes.',
                    'Presentacion de propuesta con acabados y herrajes.',
                    'Fabricacion modular e instalacion con nivelacion y ajustes.',
                ],
                'default_message' => 'Hola, necesito cotizar closets o anaqueles de cocina en Guayaquil. Quiero opcion personalizada.',
                'image_path' => 'images/works/service05.jpg',
                'is_published' => true,
            ],
            [
                'name' => 'Instalacion y reparacion de puertas de madera',
                'slug' => 'instalacion-reparacion-puertas-madera-guayaquil',
                'summary' => 'Instalacion y reparacion de puertas de madera en Guayaquil: bisagras, marcos, cerraduras y ajustes de nivel.',
                'description' => "Realizamos instalacion de puertas de madera en Guayaquil para interiores y accesos principales. Corregimos roces, desniveles, cerraduras defectuosas y marcos fuera de escuadra.\n\nTambien atendemos mantenimiento preventivo para extender vida util de puertas y herrajes.",
                'process_steps' => [
                    'Diagnostico de puerta, marco y herrajes existentes.',
                    'Ajuste o reemplazo de piezas necesarias.',
                    'Instalacion final y prueba de apertura, cierre y seguridad.',
                ],
                'default_message' => 'Hola, quiero cotizar instalacion o reparacion de puerta de madera en Guayaquil.',
                'image_path' => 'images/works/service03.jpg',
                'is_published' => true,
            ],
            [
                'name' => 'Reparacion de muebles de madera',
                'slug' => 'reparacion-muebles-madera-guayaquil',
                'summary' => 'Servicio de reparacion de muebles de madera en Guayaquil para recuperar estructura, firmeza y acabado.',
                'description' => "Recuperamos muebles de madera en Guayaquil que presentan desgaste, uniones flojas, rayones o piezas danadas. Evaluamos si conviene reparar, reforzar o reemplazar secciones.\n\nServicio ideal para prolongar vida util de muebles de hogar y oficina sin perder estetica.",
                'process_steps' => [
                    'Inspeccion de estructura, uniones y estado del acabado.',
                    'Reparacion o refuerzo de partes comprometidas.',
                    'Acabado final y recomendaciones de mantenimiento.',
                ],
                'default_message' => 'Hola, necesito reparar un mueble de madera en Guayaquil. Puedo enviar fotos y medidas.',
                'image_path' => 'images/works/service07.jpg',
                'is_published' => true,
            ],
            [
                'name' => 'Ebanisteria fina y acabados personalizados',
                'slug' => 'ebanisteria-fina-acabados-personalizados-guayaquil',
                'summary' => 'Servicio de ebanisteria en Guayaquil para piezas especiales con detalles finos y acabados personalizados.',
                'description' => "Ofrecemos ebanisteria fina en Guayaquil para proyectos con alto nivel de detalle: molduras, paneles decorativos, muebles unicos y remates de precision.\n\nEnfocamos cada trabajo en calidad de ensamble, seleccion de veta y acabado profesional para resultado duradero.",
                'process_steps' => [
                    'Brief de estilo, referencia visual y presupuesto objetivo.',
                    'Desarrollo de propuesta de fabricacion y acabado.',
                    'Ejecucion artesanal, control de detalle y entrega final.',
                ],
                'default_message' => 'Hola, quiero cotizar trabajo de ebanisteria fina en Guayaquil con acabado personalizado.',
                'image_path' => 'images/works/service04.jpg',
                'is_published' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::query()->updateOrCreate(
                ['slug' => $service['slug']],
                $service,
            );
        }

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
