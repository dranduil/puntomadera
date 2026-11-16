<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\McpChangeLog;
use Inertia\Inertia;
use Inertia\Response;

/** What the owner's AI agent changed through the MCP server. */
class McpChangeLogAdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/ai-history', [
            'logs' => McpChangeLog::query()
                ->latest()
                ->paginate(50)
                ->through(fn (McpChangeLog $log) => [
                    'id' => $log->id,
                    'tool' => $log->tool,
                    'summary' => $log->summary,
                    'arguments' => $log->arguments,
                    'created_at' => $log->created_at->format('d/m/Y H:i'),
                ]),
            'enabled' => filled(config('services.mcp.token')),
        ]);
    }
}
