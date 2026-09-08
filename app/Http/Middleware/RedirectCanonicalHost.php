<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectCanonicalHost
{
    public function handle(Request $request, Closure $next): Response
    {
        if (strtolower($request->getHost()) !== 'www.punto-madera.com') {
            return $next($request);
        }

        return redirect()->away(
            'https://punto-madera.com'.($request->getRequestUri() ?: '/'),
            301,
        );
    }
}
