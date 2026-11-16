<?php

use App\Http\Middleware\EnsureMcpToken;
use App\Mcp\Servers\PuntoMaderaServer;
use Laravel\Mcp\Facades\Mcp;

// Remote endpoint for the owner's AI agent. Off (404) unless MCP_TOKEN is set.
Mcp::web('/mcp', PuntoMaderaServer::class)
    ->middleware([EnsureMcpToken::class, 'throttle:60,1']);

// Local use: php artisan mcp:start punto-madera
Mcp::local('punto-madera', PuntoMaderaServer::class);
