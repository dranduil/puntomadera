<?php

namespace App\Support;

final class SimpleCaptcha
{
    private const SESSION_KEY = 'review_captcha';

    public function issue(): array
    {
        $first = random_int(2, 9);
        $second = random_int(1, $first);
        $subtract = random_int(0, 1) === 1;
        $operator = $subtract ? '-' : '+';
        $answer = $subtract ? $first - $second : $first + $second;
        $expiresAt = now()->addMinutes(10)->timestamp;

        session()->put(self::SESSION_KEY, [
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
        $challenge = session(self::SESSION_KEY);

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
        $challenge = session(self::SESSION_KEY);

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
        session()->forget(self::SESSION_KEY);
    }
}
