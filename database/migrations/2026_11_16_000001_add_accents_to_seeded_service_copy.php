<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Adds the missing Spanish accents to the seeded service copy that Google shows
 * as titles and snippets ("Instalacion", "diseno", "tecnica"...). A field is only
 * rewritten while it still holds the original seeded text, so copy edited from
 * the admin panel is left untouched.
 */
return new class extends Migration
{
    public function up(): void
    {
        $this->apply(fn (array $change): array => [$change[0], $change[1]]);
    }

    public function down(): void
    {
        $this->apply(fn (array $change): array => [$change[1], $change[0]]);
    }

    /**
     * @param  callable(array{0: mixed, 1: mixed}): array{0: mixed, 1: mixed}  $direction
     */
    private function apply(callable $direction): void
    {
        foreach ($this->changes() as $slug => $fields) {
            $row = DB::table('services')->where('slug', $slug)->first();

            if ($row === null) {
                continue;
            }

            $updates = [];

            foreach ($fields as $column => $change) {
                [$from, $to] = $direction($change);
                $current = $column === 'process_steps'
                    ? json_decode((string) $row->process_steps, true)
                    : $row->{$column};

                if ($current === $from) {
                    $updates[$column] = $column === 'process_steps' ? json_encode($to) : $to;
                }
            }

            if ($updates !== []) {
                DB::table('services')
                    ->where('id', $row->id)
                    ->update($updates + ['updated_at' => now()]);
            }
        }
    }

    /**
     * Seeded text => accented text, per service slug and column.
     *
     * @return array<string, array<string, array{0: mixed, 1: mixed}>>
     */
    private function changes(): array
    {
        return [
            'carpintero-a-domicilio-guayaquil' => [
                'summary' => [
                    'Servicio de carpinteria a domicilio en Guayaquil para muebles, puertas y reparaciones con visita tecnica.',
                    'Servicio de carpintería a domicilio en Guayaquil para muebles, puertas y reparaciones con visita técnica.',
                ],
                'description' => [
                    "Atendemos servicio de carpinteria a domicilio en Guayaquil y zonas cercanas. Realizamos levantamiento de medidas, recomendacion de materiales y ejecucion prolija para hogar o negocio.\n\nIdeal para quien busca carpintero en Guayaquil con atencion rapida, cotizacion clara y seguimiento por WhatsApp.",
                    "Atendemos servicio de carpintería a domicilio en Guayaquil y zonas cercanas. Realizamos levantamiento de medidas, recomendación de materiales y ejecución prolija para hogar o negocio.\n\nIdeal para quien busca carpintero en Guayaquil con atención rápida, cotización clara y seguimiento por WhatsApp.",
                ],
                'process_steps' => [
                    [
                        'Visita tecnica en Guayaquil para revisar espacio y requerimientos.',
                        'Propuesta con materiales, tiempos y presupuesto.',
                        'Fabricacion, instalacion y control final de calidad.',
                    ],
                    [
                        'Visita técnica en Guayaquil para revisar espacio y requerimientos.',
                        'Propuesta con materiales, tiempos y presupuesto.',
                        'Fabricación, instalación y control final de calidad.',
                    ],
                ],
                'default_message' => [
                    'Hola, quiero cotizar servicio de carpintero a domicilio en Guayaquil. Comparto medidas, fotos y ubicacion.',
                    'Hola, quiero cotizar servicio de carpintero a domicilio en Guayaquil. Comparto medidas, fotos y ubicación.',
                ],
            ],
            'muebles-a-medida-guayaquil' => [
                'summary' => [
                    'Diseno y fabricacion de muebles a medida en Guayaquil para sala, dormitorio, oficina y espacios pequenos.',
                    'Diseño y fabricación de muebles a medida en Guayaquil para sala, dormitorio, oficina y espacios pequeños.',
                ],
                'description' => [
                    "Fabricamos muebles a medida en Guayaquil con enfoque funcional y acabado fino. Trabajamos melamina, MDF y madera segun uso del ambiente, presupuesto y estilo.\n\nOptimizamos distribucion para departamentos, casas y locales comerciales, priorizando durabilidad y facil mantenimiento.",
                    "Fabricamos muebles a medida en Guayaquil con enfoque funcional y acabado fino. Trabajamos melamina, MDF y madera según uso del ambiente, presupuesto y estilo.\n\nOptimizamos distribución para departamentos, casas y locales comerciales, priorizando durabilidad y fácil mantenimiento.",
                ],
                'process_steps' => [
                    [
                        'Definicion de estilo, medidas y uso del mueble.',
                        'Diseno tecnico y seleccion de material segun presupuesto.',
                        'Fabricacion, entrega e instalacion en sitio.',
                    ],
                    [
                        'Definición de estilo, medidas y uso del mueble.',
                        'Diseño técnico y selección de material según presupuesto.',
                        'Fabricación, entrega e instalación en sitio.',
                    ],
                ],
            ],
            'closets-anaqueles-cocina-guayaquil' => [
                'summary' => [
                    'Fabricacion e instalacion de closets y anaqueles de cocina en Guayaquil con diseno personalizado.',
                    'Fabricación e instalación de closets y anaqueles de cocina en Guayaquil con diseño personalizado.',
                ],
                'description' => [
                    "Desarrollamos closets empotrados y anaqueles de cocina en Guayaquil, adaptados a dimensiones reales y flujo diario de uso. Disenamos interiores para maximizar orden, capacidad y accesibilidad.\n\nServicio pensado para remodelaciones y proyectos nuevos con acompanamiento completo desde diseno hasta instalacion.",
                    "Desarrollamos closets empotrados y anaqueles de cocina en Guayaquil, adaptados a dimensiones reales y flujo diario de uso. Diseñamos interiores para maximizar orden, capacidad y accesibilidad.\n\nServicio pensado para remodelaciones y proyectos nuevos con acompañamiento completo desde diseño hasta instalación.",
                ],
                'process_steps' => [
                    [
                        'Medicion del area, definicion de distribucion interior y frentes.',
                        'Presentacion de propuesta con acabados y herrajes.',
                        'Fabricacion modular e instalacion con nivelacion y ajustes.',
                    ],
                    [
                        'Medición del área, definición de distribución interior y frentes.',
                        'Presentación de propuesta con acabados y herrajes.',
                        'Fabricación modular e instalación con nivelación y ajustes.',
                    ],
                ],
                'default_message' => [
                    'Hola, necesito cotizar closets o anaqueles de cocina en Guayaquil. Quiero opcion personalizada.',
                    'Hola, necesito cotizar closets o anaqueles de cocina en Guayaquil. Quiero opción personalizada.',
                ],
            ],
            'instalacion-reparacion-puertas-madera-guayaquil' => [
                'name' => [
                    'Instalacion y reparacion de puertas de madera',
                    'Instalación y reparación de puertas de madera',
                ],
                'summary' => [
                    'Instalacion y reparacion de puertas de madera en Guayaquil: bisagras, marcos, cerraduras y ajustes de nivel.',
                    'Instalación y reparación de puertas de madera en Guayaquil: bisagras, marcos, cerraduras y ajustes de nivel.',
                ],
                'description' => [
                    "Realizamos instalacion de puertas de madera en Guayaquil para interiores y accesos principales. Corregimos roces, desniveles, cerraduras defectuosas y marcos fuera de escuadra.\n\nTambien atendemos mantenimiento preventivo para extender vida util de puertas y herrajes.",
                    "Realizamos instalación de puertas de madera en Guayaquil para interiores y accesos principales. Corregimos roces, desniveles, cerraduras defectuosas y marcos fuera de escuadra.\n\nTambién atendemos mantenimiento preventivo para extender vida útil de puertas y herrajes.",
                ],
                'process_steps' => [
                    [
                        'Diagnostico de puerta, marco y herrajes existentes.',
                        'Ajuste o reemplazo de piezas necesarias.',
                        'Instalacion final y prueba de apertura, cierre y seguridad.',
                    ],
                    [
                        'Diagnóstico de puerta, marco y herrajes existentes.',
                        'Ajuste o reemplazo de piezas necesarias.',
                        'Instalación final y prueba de apertura, cierre y seguridad.',
                    ],
                ],
                'default_message' => [
                    'Hola, quiero cotizar instalacion o reparacion de puerta de madera en Guayaquil.',
                    'Hola, quiero cotizar instalación o reparación de puerta de madera en Guayaquil.',
                ],
            ],
            'reparacion-muebles-madera-guayaquil' => [
                'name' => [
                    'Reparacion de muebles de madera',
                    'Reparación de muebles de madera',
                ],
                'summary' => [
                    'Servicio de reparacion de muebles de madera en Guayaquil para recuperar estructura, firmeza y acabado.',
                    'Servicio de reparación de muebles de madera en Guayaquil para recuperar estructura, firmeza y acabado.',
                ],
                'description' => [
                    "Recuperamos muebles de madera en Guayaquil que presentan desgaste, uniones flojas, rayones o piezas danadas. Evaluamos si conviene reparar, reforzar o reemplazar secciones.\n\nServicio ideal para prolongar vida util de muebles de hogar y oficina sin perder estetica.",
                    "Recuperamos muebles de madera en Guayaquil que presentan desgaste, uniones flojas, rayones o piezas dañadas. Evaluamos si conviene reparar, reforzar o reemplazar secciones.\n\nServicio ideal para prolongar vida útil de muebles de hogar y oficina sin perder estética.",
                ],
                'process_steps' => [
                    [
                        'Inspeccion de estructura, uniones y estado del acabado.',
                        'Reparacion o refuerzo de partes comprometidas.',
                        'Acabado final y recomendaciones de mantenimiento.',
                    ],
                    [
                        'Inspección de estructura, uniones y estado del acabado.',
                        'Reparación o refuerzo de partes comprometidas.',
                        'Acabado final y recomendaciones de mantenimiento.',
                    ],
                ],
            ],
            'ebanisteria-fina-acabados-personalizados-guayaquil' => [
                'name' => [
                    'Ebanisteria fina y acabados personalizados',
                    'Ebanistería fina y acabados personalizados',
                ],
                'summary' => [
                    'Servicio de ebanisteria en Guayaquil para piezas especiales con detalles finos y acabados personalizados.',
                    'Servicio de ebanistería en Guayaquil para piezas especiales con detalles finos y acabados personalizados.',
                ],
                'description' => [
                    "Ofrecemos ebanisteria fina en Guayaquil para proyectos con alto nivel de detalle: molduras, paneles decorativos, muebles unicos y remates de precision.\n\nEnfocamos cada trabajo en calidad de ensamble, seleccion de veta y acabado profesional para resultado duradero.",
                    "Ofrecemos ebanistería fina en Guayaquil para proyectos con alto nivel de detalle: molduras, paneles decorativos, muebles únicos y remates de precisión.\n\nEnfocamos cada trabajo en calidad de ensamble, selección de veta y acabado profesional para resultado duradero.",
                ],
                'process_steps' => [
                    [
                        'Brief de estilo, referencia visual y presupuesto objetivo.',
                        'Desarrollo de propuesta de fabricacion y acabado.',
                        'Ejecucion artesanal, control de detalle y entrega final.',
                    ],
                    [
                        'Brief de estilo, referencia visual y presupuesto objetivo.',
                        'Desarrollo de propuesta de fabricación y acabado.',
                        'Ejecución artesanal, control de detalle y entrega final.',
                    ],
                ],
                'default_message' => [
                    'Hola, quiero cotizar trabajo de ebanisteria fina en Guayaquil con acabado personalizado.',
                    'Hola, quiero cotizar trabajo de ebanistería fina en Guayaquil con acabado personalizado.',
                ],
            ],
        ];
    }
};
