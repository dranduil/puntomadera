<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreWorkRequest;
use App\Http\Requests\Admin\UpdateWorkRequest;
use App\Models\Work;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class WorkAdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/works', [
            'works' => Work::query()
                ->latest()
                ->paginate(20)
                ->withQueryString(),
        ]);
    }

    public function store(StoreWorkRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $data['slug'] = $this->uniqueSlug($data['slug'] ?? Str::slug($data['title']));

        Work::query()->create($data);

        return to_route('admin.works.index');
    }

    public function update(UpdateWorkRequest $request, Work $work): RedirectResponse
    {
        $data = $request->validated();

        if (isset($data['slug']) && $data['slug'] !== $work->slug) {
            $data['slug'] = $this->uniqueSlug($data['slug']);
        }

        $work->update($data);

        return to_route('admin.works.index');
    }

    public function destroy(Work $work): RedirectResponse
    {
        $work->delete();

        return to_route('admin.works.index');
    }

    private function uniqueSlug(string $base): string
    {
        $slug = $base;
        $i = 1;

        while (Work::query()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}

