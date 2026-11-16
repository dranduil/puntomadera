<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google_analytics' => [
        'measurement_id' => env('GOOGLE_ANALYTICS_ID'),
    ],

    'meta_pixel' => [
        'id' => env('META_PIXEL_ID'),
    ],

    'whatsapp' => [
        'number' => env('WHATSAPP_NUMBER', env('VITE_WHATSAPP_NUMBER', '593998897813')),
    ],

    // Bearer token for the /mcp endpoint used by the owner's AI agent.
    // Leave empty to keep the endpoint switched off (it answers 404).
    'mcp' => [
        'token' => env('MCP_TOKEN'),
    ],

    // Business details for LocalBusiness structured data. Keep them identical
    // to the Google Business Profile so Google links the site to that listing.
    'business' => [
        'phone' => env('BUSINESS_PHONE'),
        'street_address' => env('BUSINESS_STREET_ADDRESS'),
        // schema.org format, e.g. "Mo-Fr 08:00-18:00, Sa 08:00-13:00"
        'opening_hours' => env('BUSINESS_OPENING_HOURS'),
        // Comma-separated profile URLs: Google Business Profile, Instagram, Facebook...
        'same_as' => array_values(array_filter(array_map(
            'trim',
            explode(',', (string) env('BUSINESS_SAME_AS', '')),
        ))),
    ],

];
