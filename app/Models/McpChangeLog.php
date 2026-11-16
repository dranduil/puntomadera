<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class McpChangeLog extends Model
{
    protected $fillable = ['tool', 'arguments', 'summary'];

    protected function casts(): array
    {
        return ['arguments' => 'array'];
    }
}
