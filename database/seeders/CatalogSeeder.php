<?php

namespace Database\Seeders;

use App\Models\CatalogItem;
use App\Models\Service;
use App\Models\ServiceZone;
use Illuminate\Database\Seeder;

/**
 * Starting price list proposed on 16/11/2026 (USD, stored in cents). Rows are
 * only created when missing, so prices edited later in the admin are kept.
 * Product and partner prices start at 0: they depend on the supplier and are
 * filled in from the admin before quoting.
 */
class CatalogSeeder extends Seeder
{
    private const PUERTAS = 'instalacion-reparacion-puertas-madera-guayaquil';

    private const CLOSETS = 'closets-anaqueles-cocina-guayaquil';

    private const MUEBLES = 'muebles-a-medida-guayaquil';

    private const REPARACION = 'reparacion-muebles-madera-guayaquil';

    private const DOMICILIO = 'carpintero-a-domicilio-guayaquil';

    public function run(): void
    {
        $this->seedZones();

        $serviceIds = Service::query()->pluck('id', 'slug');
        $sort = 0;

        foreach ($this->items() as $item) {
            $serviceSlug = $item['service'] ?? null;
            unset($item['service']);

            CatalogItem::query()->firstOrCreate(
                ['slug' => $item['slug']],
                [
                    'kind' => 'servicio',
                    'unit' => 'unidad',
                    'price_max_cents' => null,
                    'includes_material' => false,
                    'is_public' => true,
                    'is_active' => true,
                    ...$item,
                    'service_id' => $serviceSlug ? $serviceIds->get($serviceSlug) : null,
                    'sort_order' => $sort += 10,
                ],
            );
        }

        $this->seedSuggestions();
    }

    private function seedZones(): void
    {
        $zones = [
            ['Zona A · Sur', ['Guasmo', 'Floresta', 'Pradera', 'Esteros', 'Trinitaria', 'Acacias'], 500, 1000],
            ['Zona B · Centro / Suroeste', ['Centro', 'Cristo del Consuelo', 'Batallón del Suburbio'], 1000, 1500],
            ['Zona C · Norte', ['Urdesa', 'Kennedy', 'Alborada', 'Garzota', 'Sauces', 'Ceibos'], 1500, 2000],
            ['Zona D · Periferia', ['Samborondón', 'La Aurora', 'Vía a la Costa', 'Durán'], 2000, 2500],
            ['Fuera de Guayaquil', ['Playas', 'Milagro', 'Salinas'], null, null],
        ];

        foreach ($zones as $index => [$name, $neighborhoods, $travel, $visit]) {
            ServiceZone::query()->firstOrCreate(['name' => $name], [
                'neighborhoods' => $neighborhoods,
                'travel_fee_cents' => $travel,
                'visit_fee_cents' => $visit,
                'sort_order' => ($index + 1) * 10,
            ]);
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function items(): array
    {
        $doorIcon = 'images/service-icons/puertas-instalacion.png';
        $locks = 'images/doors-cotizacion/chapas-herrajes-referencia.jpg';

        return [
            // Puertas: mano de obra
            ['slug' => 'rapido-puerta-interior', 'service' => self::PUERTAS, 'name' => 'Instalación de puerta interior', 'description' => 'Con la puerta que ya tienes.', 'price_min_cents' => 3500, 'price_max_cents' => 4500, 'image_path' => $doorIcon],
            ['slug' => 'rapido-puerta-principal', 'service' => self::PUERTAS, 'name' => 'Instalación de puerta principal o maciza', 'price_min_cents' => 5500, 'price_max_cents' => 7500, 'image_path' => $doorIcon],
            ['slug' => 'rapido-marco', 'service' => self::PUERTAS, 'name' => 'Instalación de marco', 'price_min_cents' => 2500, 'price_max_cents' => 3500],
            ['slug' => 'rapido-ajuste-puerta', 'service' => self::PUERTAS, 'name' => 'Ajuste de puerta que roza o no cierra', 'description' => 'Cepillado, nivelación y ajuste de bisagras.', 'price_min_cents' => 2000, 'price_max_cents' => 3000],
            ['slug' => 'rapido-bisagras-puerta', 'service' => self::PUERTAS, 'name' => 'Cambio de bisagras de puerta', 'description' => 'Juego de 3 bisagras; las bisagras se cobran aparte.', 'price_min_cents' => 1500, 'price_max_cents' => 2000],
            ['slug' => 'rapido-cerradura-pomo', 'service' => self::PUERTAS, 'name' => 'Instalación de cerradura de pomo', 'price_min_cents' => 1500, 'price_max_cents' => 2000],
            ['slug' => 'rapido-cerradura-sobreponer', 'service' => self::PUERTAS, 'name' => 'Instalación de cerradura de sobreponer o cerrojo', 'price_min_cents' => 2500, 'price_max_cents' => 3500],
            ['slug' => 'rapido-cerradura-digital', 'service' => self::PUERTAS, 'name' => 'Instalación de cerradura digital', 'price_min_cents' => 3500, 'price_max_cents' => 5000],
            // Puertas: con material
            ['slug' => 'material-puerta-mdf', 'service' => self::PUERTAS, 'name' => 'Puerta interior MDF con marco, instalada', 'description' => 'Puerta tamborada, marco y bisagras. La chapa va aparte.', 'price_min_cents' => 14000, 'price_max_cents' => 18000, 'includes_material' => true, 'image_path' => 'images/doors-cotizacion/puerta-laqueada-referencia.jpg'],
            ['slug' => 'material-puerta-laurel', 'service' => self::PUERTAS, 'name' => 'Puerta de laurel o madera sólida con marco, instalada', 'price_min_cents' => 22000, 'price_max_cents' => 32000, 'includes_material' => true, 'image_path' => 'images/doors-cotizacion/puerta-madera-referencia.jpg'],
            // Puertas: productos (precio del proveedor, se completa en el admin)
            ['slug' => 'producto-chapa-pomo', 'service' => self::PUERTAS, 'kind' => 'producto', 'name' => 'Chapa de pomo', 'includes_material' => true, 'image_path' => $locks],
            ['slug' => 'producto-chapa-sobreponer', 'service' => self::PUERTAS, 'kind' => 'producto', 'name' => 'Cerradura de sobreponer o cerrojo', 'includes_material' => true, 'image_path' => $locks],
            ['slug' => 'producto-cerradura-digital', 'service' => self::PUERTAS, 'kind' => 'producto', 'name' => 'Cerradura digital', 'description' => 'Con clave, tarjeta o huella según el modelo.', 'includes_material' => true, 'image_path' => $locks],
            ['slug' => 'producto-bisagras-puerta', 'service' => self::PUERTAS, 'kind' => 'producto', 'name' => 'Juego de 3 bisagras para puerta', 'includes_material' => true, 'image_path' => $locks],
            // Closets y cocinas
            ['slug' => 'material-closet-batiente', 'service' => self::CLOSETS, 'name' => 'Closet de melamina con puertas batientes', 'description' => 'Melamina 18 mm, de piso a 2,40 m.', 'unit' => 'metro_lineal', 'price_min_cents' => 22000, 'price_max_cents' => 28000, 'includes_material' => true, 'image_path' => 'images/service-icons/closets-empotrados.png'],
            ['slug' => 'material-closet-corredizo', 'service' => self::CLOSETS, 'name' => 'Closet con puertas corredizas o más cajones', 'unit' => 'metro_lineal', 'price_min_cents' => 26000, 'price_max_cents' => 33000, 'includes_material' => true, 'image_path' => 'images/service-icons/closets-empotrados.png'],
            ['slug' => 'material-cocina-baja', 'service' => self::CLOSETS, 'name' => 'Cocina: mueble bajo de melamina RH', 'description' => 'Resistente a la humedad. El mesón va aparte.', 'unit' => 'metro_lineal', 'price_min_cents' => 15000, 'price_max_cents' => 19000, 'includes_material' => true, 'image_path' => 'images/service-icons/cocinas-anaqueles.png'],
            ['slug' => 'material-cocina-alta', 'service' => self::CLOSETS, 'name' => 'Cocina: mueble alto de melamina RH', 'unit' => 'metro_lineal', 'price_min_cents' => 13000, 'price_max_cents' => 17000, 'includes_material' => true, 'image_path' => 'images/service-icons/cocinas-anaqueles.png'],
            ['slug' => 'rapido-ajuste-closet-cocina', 'service' => self::CLOSETS, 'name' => 'Ajuste de closet o cocina', 'description' => 'Puertas caídas, nivelación y ajustes.', 'unit' => 'servicio', 'price_min_cents' => 2500, 'price_max_cents' => 4500],
            ['slug' => 'rapido-bisagras-mueble', 'service' => self::CLOSETS, 'name' => 'Cambio de bisagras de mueble o cocina', 'description' => 'Precio por puerta.', 'price_min_cents' => 500, 'price_max_cents' => 800],
            ['slug' => 'rapido-rieles-cajon', 'service' => self::CLOSETS, 'name' => 'Cambio de rieles de cajón', 'description' => 'Precio por cajón; los rieles van aparte.', 'price_min_cents' => 1000, 'price_max_cents' => 1500],
            ['slug' => 'producto-rieles-telescopicos', 'service' => self::CLOSETS, 'kind' => 'producto', 'name' => 'Rieles telescópicos para cajón', 'includes_material' => true],
            ['slug' => 'material-extra-cierre-suave', 'service' => self::CLOSETS, 'kind' => 'extra', 'name' => 'Bisagras de cierre suave', 'description' => 'Las puertas cierran despacio y sin golpe. Precio por puerta.', 'price_min_cents' => 800, 'price_max_cents' => 1200, 'includes_material' => true],
            ['slug' => 'material-extra-mdf-lacado', 'service' => self::CLOSETS, 'kind' => 'extra', 'name' => 'Acabado MDF lacado en vez de melamina', 'unit' => 'porcentaje', 'price_min_cents' => 40, 'price_max_cents' => 60, 'includes_material' => true],
            ['slug' => 'aliado-meson-granito', 'service' => self::CLOSETS, 'kind' => 'aliado', 'name' => 'Mesón de granito instalado', 'description' => 'Lo coordinamos con un aliado de confianza.', 'unit' => 'metro_lineal', 'includes_material' => true],
            ['slug' => 'aliado-meson-cuarzo', 'service' => self::CLOSETS, 'kind' => 'aliado', 'name' => 'Mesón de cuarzo instalado', 'description' => 'Lo coordinamos con un aliado de confianza.', 'unit' => 'metro_lineal', 'includes_material' => true],
            // Muebles a medida
            ['slug' => 'material-mueble-bano', 'service' => self::MUEBLES, 'name' => 'Mueble de baño de melamina RH', 'price_min_cents' => 12000, 'includes_material' => true, 'image_path' => 'images/service-icons/muebles-a-medida.png'],
            ['slug' => 'material-escritorio', 'service' => self::MUEBLES, 'name' => 'Escritorio a medida', 'price_min_cents' => 15000, 'includes_material' => true, 'image_path' => 'images/service-icons/muebles-a-medida.png'],
            ['slug' => 'material-mueble-tv', 'service' => self::MUEBLES, 'name' => 'Mueble de TV', 'price_min_cents' => 18000, 'includes_material' => true, 'image_path' => 'images/service-icons/muebles-a-medida.png'],
            ['slug' => 'aliado-mampara-vidrio', 'service' => null, 'kind' => 'aliado', 'name' => 'Mampara de vidrio para ducha', 'description' => 'La coordinamos con un aliado de confianza.', 'includes_material' => true],
            // Reparación de muebles
            ['slug' => 'rapido-reparacion-mueble', 'service' => self::REPARACION, 'name' => 'Reparación de mueble pequeño', 'description' => 'Silla, velador, cajón o similar.', 'price_min_cents' => 2000, 'price_max_cents' => 3500, 'image_path' => 'images/service-icons/reparacion-muebles.png'],
            // Cargos internos: solo se usan al armar la cotización
            ['slug' => 'cargo-minimo-visita', 'service' => self::DOMICILIO, 'name' => 'Cargo mínimo por visita (mano de obra)', 'unit' => 'servicio', 'price_min_cents' => 2500, 'is_public' => false],
            ['slug' => 'recargo-urgencia', 'service' => null, 'kind' => 'extra', 'name' => 'Recargo por urgencia (mismo día, domingo o feriado)', 'unit' => 'porcentaje', 'price_min_cents' => 30, 'is_public' => false],
            ['slug' => 'recargo-piso-alto', 'service' => null, 'kind' => 'extra', 'name' => 'Recargo piso 3 o más sin ascensor', 'unit' => 'porcentaje', 'price_min_cents' => 10, 'is_public' => false],
            ['slug' => 'recargo-retiro-viejo', 'service' => null, 'kind' => 'extra', 'name' => 'Retiro de puerta o mueble viejo', 'price_min_cents' => 500, 'price_max_cents' => 1000, 'is_public' => false],
        ];
    }

    private function seedSuggestions(): void
    {
        $suggestions = [
            'rapido-puerta-interior' => [['producto-chapa-pomo', 'Chapa nueva para tu puerta'], ['producto-bisagras-puerta', 'Bisagras nuevas para que no se caiga']],
            'rapido-puerta-principal' => [['producto-cerradura-digital', 'Más seguridad con cerradura digital'], ['producto-chapa-sobreponer', 'Cerrojo de seguridad']],
            'material-puerta-mdf' => [['producto-chapa-pomo', 'La puerta no incluye chapa']],
            'material-puerta-laurel' => [['producto-cerradura-digital', 'Más seguridad con cerradura digital'], ['producto-chapa-sobreponer', 'Cerrojo de seguridad']],
            'rapido-cerradura-digital' => [['producto-cerradura-digital', '¿No tienes la cerradura? Te la conseguimos']],
            'rapido-cerradura-sobreponer' => [['producto-chapa-sobreponer', '¿No tienes la cerradura? Te la conseguimos']],
            'rapido-cerradura-pomo' => [['producto-chapa-pomo', '¿No tienes la chapa? Te la conseguimos']],
            'rapido-bisagras-puerta' => [['producto-bisagras-puerta', 'Te llevamos las bisagras']],
            'material-closet-batiente' => [['material-extra-cierre-suave', 'Puertas que cierran suave y sin golpe']],
            'material-closet-corredizo' => [['material-extra-cierre-suave', 'Cajones y puertas que cierran suave']],
            'material-cocina-baja' => [['aliado-meson-cuarzo', 'Mesón de cuarzo instalado'], ['aliado-meson-granito', 'Mesón de granito instalado'], ['material-extra-cierre-suave', 'Puertas que cierran suave y sin golpe']],
            'material-cocina-alta' => [['material-extra-cierre-suave', 'Puertas que cierran suave y sin golpe']],
            'rapido-ajuste-closet-cocina' => [['rapido-bisagras-mueble', 'Cambia las bisagras gastadas'], ['rapido-rieles-cajon', 'Cajones que corren bien otra vez']],
            'rapido-rieles-cajon' => [['producto-rieles-telescopicos', 'Te llevamos los rieles']],
            'material-mueble-bano' => [['aliado-mampara-vidrio', 'Mampara de vidrio para la ducha']],
        ];

        $ids = CatalogItem::query()->pluck('id', 'slug');

        foreach ($suggestions as $slug => $targets) {
            $item = CatalogItem::query()->find($ids->get($slug));

            if (! $item) {
                continue;
            }

            foreach ($targets as $index => [$targetSlug, $reason]) {
                $targetId = $ids->get($targetSlug);

                if ($targetId && ! $item->suggestions()->whereKey($targetId)->exists()) {
                    $item->suggestions()->attach($targetId, ['reason' => $reason, 'sort_order' => ($index + 1) * 10]);
                }
            }
        }
    }
}
