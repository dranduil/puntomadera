<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Guards the MCP endpoint with a single bearer token from the server env.
 * Without a configured token the endpoint does not exist (404).
 */
class EnsureMcpToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = (string) config('services.mcp.token');

        abort_if($token === '', 404);

        if (! hash_equals($token, (string) $request->bearerToken())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
