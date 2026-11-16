<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Carpintero a domicilio en Guayaquil',
                'slug' => 'carpintero-a-domicilio-guayaquil',
                'summary' => 'Servicio de carpintería a domicilio en Guayaquil para muebles, puertas y reparaciones con visita técnica.',
                'description' => "Atendemos servicio de carpintería a domicilio en Guayaquil y zonas cercanas. Realizamos levantamiento de medidas, recomendación de materiales y ejecución prolija para hogar o negocio.\n\nIdeal para quien busca carpintero en Guayaquil con atención rápida, cotización clara y seguimiento por WhatsApp.",
                'process_steps' => [
                    'Visita técnica en Guayaquil para revisar espacio y requerimientos.',
                    'Propuesta con materiales, tiempos y presupuesto.',
                    'Fabricación, instalación y control final de calidad.',
                ],
                'default_message' => 'Hola, quiero cotizar servicio de carpintero a domicilio en Guayaquil. Comparto medidas, fotos y ubicación.',
                'image_path' => 'images/works/service06.jpg',
                'is_published' => true,
            ],
            [
                'name' => 'Muebles a medida en Guayaquil',
                'slug' => 'muebles-a-medida-guayaquil',
                'summary' => 'Diseño y fabricación de muebles a medida en Guayaquil para sala, dormitorio, oficina y espacios pequeños.',
                'description' => "Fabricamos muebles a medida en Guayaquil con enfoque funcional y acabado fino. Trabajamos melamina, MDF y madera según uso del ambiente, presupuesto y estilo.\n\nOptimizamos distribución para departamentos, casas y locales comerciales, priorizando durabilidad y fácil mantenimiento.",
                'process_steps' => [
                    'Definición de estilo, medidas y uso del mueble.',
                    'Diseño técnico y selección de material según presupuesto.',
                    'Fabricación, entrega e instalación en sitio.',
                ],
                'default_message' => 'Hola, deseo cotizar muebles a medida en Guayaquil. Tengo referencias, medidas y fotos del espacio.',
                'image_path' => 'images/works/service01.jpg',
                'is_published' => true,
            ],
            [
                'name' => 'Closets y anaqueles de cocina en Guayaquil',
                'slug' => 'closets-anaqueles-cocina-guayaquil',
                'summary' => 'Fabricación e instalación de closets y anaqueles de cocina en Guayaquil con diseño personalizado.',
                'description' => "Desarrollamos closets empotrados y anaqueles de cocina en Guayaquil, adaptados a dimensiones reales y flujo diario de uso. Diseñamos interiores para maximizar orden, capacidad y accesibilidad.\n\nServicio pensado para remodelaciones y proyectos nuevos con acompañamiento completo desde diseño hasta instalación.",
                'process_steps' => [
                    'Medición del área, definición de distribución interior y frentes.',
                    'Presentación de propuesta con acabados y herrajes.',
                    'Fabricación modular e instalación con nivelación y ajustes.',
                ],
                'default_message' => 'Hola, necesito cotizar closets o anaqueles de cocina en Guayaquil. Quiero opción personalizada.',
                'image_path' => 'images/works/service05.jpg',
                'is_published' => true,
            ],
            [
                'name' => 'Instalación y reparación de puertas de madera',
                'slug' => 'instalacion-reparacion-puertas-madera-guayaquil',
                'summary' => 'Instalación y reparación de puertas de madera en Guayaquil: bisagras, marcos, cerraduras y ajustes de nivel.',
                'description' => "Realizamos instalación de puertas de madera en Guayaquil para interiores y accesos principales. Corregimos roces, desniveles, cerraduras defectuosas y marcos fuera de escuadra.\n\nTambien atendemos mantenimiento preventivo para extender vida útil de puertas y herrajes.",
                'process_steps' => [
                    'Diagnóstico de puerta, marco y herrajes existentes.',
                    'Ajuste o reemplazo de piezas necesarias.',
                    'Instalación final y prueba de apertura, cierre y seguridad.',
                ],
                'default_message' => 'Hola, quiero cotizar instalación o reparación de puerta de madera en Guayaquil.',
                'image_path' => 'images/works/service03.jpg',
                'is_published' => true,
            ],
            [
                'name' => 'Reparación de muebles de madera',
                'slug' => 'reparacion-muebles-madera-guayaquil',
                'summary' => 'Servicio de reparación de muebles de madera en Guayaquil para recuperar estructura, firmeza y acabado.',
                'description' => "Recuperamos muebles de madera en Guayaquil que presentan desgaste, uniones flojas, rayones o piezas dañadas. Evaluamos si conviene reparar, reforzar o reemplazar secciones.\n\nServicio ideal para prolongar vida útil de muebles de hogar y oficina sin perder estética.",
                'process_steps' => [
                    'Inspección de estructura, uniones y estado del acabado.',
                    'Reparación o refuerzo de partes comprometidas.',
                    'Acabado final y recomendaciones de mantenimiento.',
                ],
                'default_message' => 'Hola, necesito reparar un mueble de madera en Guayaquil. Puedo enviar fotos y medidas.',
                'image_path' => 'images/works/service07.jpg',
                'is_published' => true,
            ],
            [
                'name' => 'Ebanistería fina y acabados personalizados',
                'slug' => 'ebanisteria-fina-acabados-personalizados-guayaquil',
                'summary' => 'Servicio de ebanistería en Guayaquil para piezas especiales con detalles finos y acabados personalizados.',
                'description' => "Ofrecemos ebanistería fina en Guayaquil para proyectos con alto nivel de detalle: molduras, paneles decorativos, muebles únicos y remates de precisión.\n\nEnfocamos cada trabajo en calidad de ensamble, selección de veta y acabado profesional para resultado duradero.",
                'process_steps' => [
                    'Brief de estilo, referencia visual y presupuesto objetivo.',
                    'Desarrollo de propuesta de fabricación y acabado.',
                    'Ejecución artesanal, control de detalle y entrega final.',
                ],
                'default_message' => 'Hola, quiero cotizar trabajo de ebanistería fina en Guayaquil con acabado personalizado.',
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
    }
}
