<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\User;
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
                'is_published' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::query()->updateOrCreate(
                ['slug' => $service['slug']],
                $service,
            );
        }
    }
}
