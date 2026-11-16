<?php

namespace App\Mcp\Tools;

use App\Mcp\Tools\Concerns\FindsRecords;
use App\Models\McpChangeLog;
use Laravel\Mcp\Request;
use Laravel\Mcp\Server\Tool;

/** Base for tools that change data: every change is written to the audit log. */
abstract class WriteTool extends Tool
{
    use FindsRecords;

    protected function logChange(Request $request, string $summary): void
    {
        McpChangeLog::record($this->name(), $request->all(), $summary);
    }
}
