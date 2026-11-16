<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/** Audit trail of every change the AI agent makes through the MCP server. */
class McpChangeLog extends Model
{
    protected $fillable = ['tool', 'arguments', 'summary'];

    protected function casts(): array
    {
        return ['arguments' => 'array'];
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    public static function record(string $tool, array $arguments, string $summary): self
    {
        return self::query()->create([
            'tool' => $tool,
            'arguments' => $arguments,
            'summary' => Str::limit($summary, 495),
        ]);
    }
}
