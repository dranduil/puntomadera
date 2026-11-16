<?php

namespace App\Support;

/**
 * Small math challenge kept in the session. Each public form uses its own key
 * so a review and a quote request open in two tabs don't overwrite each other.
 */
final class SimpleCaptcha
{
    public function __construct(private string $sessionKey = 'review_captcha') {}

    public static function for(string $sessionKey): self
    {
        return new self($sessionKey);
    }

    public function issue(): array
    {
        $first = random_int(2, 9);
        $second = random_int(1, $first);
        $subtract = random_int(0, 1) === 1;
        $operator = $subtract ? '-' : '+';
        $answer = $subtract ? $first - $second : $first + $second;
        $expiresAt = now()->addMinutes(10)->timestamp;

        session()->put($this->sessionKey, [
            'question' => "¿Cuánto es {$first} {$operator} {$second}?",
            'answer' => hash('sha256', (string) $answer),
            'expires_at' => $expiresAt,
        ]);

        return [
            'question' => "¿Cuánto es {$first} {$operator} {$second}?",
        ];
    }

    public function challenge(): array
    {
        $challenge = session($this->sessionKey);

        if (! is_array($challenge)
            || ! isset($challenge['question'], $challenge['answer'], $challenge['expires_at'])
            || (int) $challenge['expires_at'] < now()->timestamp) {
            return $this->issue();
        }

        return [
            'question' => (string) $challenge['question'],
        ];
    }

    public function passes(mixed $answer): bool
    {
        $challenge = session($this->sessionKey);

        if (! is_array($challenge)
            || ! isset($challenge['answer'], $challenge['expires_at'])
            || (int) $challenge['expires_at'] < now()->timestamp) {
            $this->clear();

            return false;
        }

        $normalized = trim((string) $answer);

        if (preg_match('/^-?\d+$/', $normalized) !== 1) {
            return false;
        }

        return hash_equals(
            (string) $challenge['answer'],
            hash('sha256', $normalized),
        );
    }

    public function clear(): void
    {
        session()->forget($this->sessionKey);
    }
}
