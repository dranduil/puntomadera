<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Remembers where a visitor came from (ad campaign UTM tags and the first page
 * they landed on) so a quote request can be attributed to its source.
 */
class CaptureAttribution
{
    public const SESSION_KEY = 'attribution';

    private const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'];

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('GET') && ! $request->is('admin/*', 'dashboard', 'settings/*', 'mcp')) {
            $attribution = (array) $request->session()->get(self::SESSION_KEY, []);
            $utm = collect(self::UTM_KEYS)
                ->mapWithKeys(fn (string $key) => [$key => mb_substr(trim((string) $request->query($key, '')), 0, 100)])
                ->filter()
                ->all();

            if ($utm !== []) {
                $attribution = [...$attribution, ...$utm];
            }

            $attribution['landing_path'] ??= mb_substr('/'.ltrim($request->path(), '/'), 0, 255);

            $request->session()->put(self::SESSION_KEY, $attribution);
        }

        return $next($request);
    }

    /**
     * @return array{utm_source: ?string, utm_medium: ?string, utm_campaign: ?string, source_path: ?string}
     */
    public static function fromSession(Request $request): array
    {
        $attribution = (array) $request->session()->get(self::SESSION_KEY, []);

        return [
            'utm_source' => $attribution['utm_source'] ?? null,
            'utm_medium' => $attribution['utm_medium'] ?? null,
            'utm_campaign' => $attribution['utm_campaign'] ?? null,
            'source_path' => $attribution['landing_path'] ?? null,
        ];
    }
}
