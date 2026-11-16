<?php

namespace App\Mcp\Tools;

use App\Support\BusinessMetrics;
use Carbon\Carbon;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Description('Business numbers for a month: requests, quotes sent/viewed/accepted, close rate, accepted value, payments, commissions owed and leads by source. Money is in cents.')]
#[IsReadOnly]
class BusinessSummary extends ReadTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate(['month' => ['nullable', 'date_format:Y-m']]);
        $month = isset($data['month']) ? Carbon::createFromFormat('Y-m-d', "{$data['month']}-01") : now();

        return Response::json(BusinessMetrics::forMonth($month));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'month' => $schema->string()->description('Month as YYYY-MM. Default: current month.'),
        ];
    }
}
