# Local SEO Service Pages Spec

## Requirements

**User Story 1:** As a builder or homeowner in Guayaquil, I want a page about door installation for new construction, so that I can quickly understand whether Punto Madera can install interior/exterior doors professionally.

**Acceptance Criteria**
1. WHEN a visitor opens `/instalacion-puertas-guayaquil` THEN the system SHALL show Spanish content focused on door installation in new construction in Guayaquil.
2. WHEN the page is crawled THEN the system SHALL include a unique title, meta description, canonical URL, visible local service copy, and JSON-LD aligned with visible content.
3. WHEN the visitor wants contact THEN the system SHALL provide WhatsApp and contact calls to action.

**User Story 2:** As a local homeowner, I want a page about door repair, so that I can decide if Punto Madera handles alignment, hinges, locks, frames, and damaged wood.

**Acceptance Criteria**
1. WHEN a visitor opens `/reparacion-puertas-guayaquil` THEN the system SHALL show Spanish content focused on door repair in Guayaquil.
2. WHEN the page is crawled THEN the system SHALL include service-specific FAQ content and structured data.
3. IF a WhatsApp number is configured THEN the system SHALL use it in the page CTA.

**User Story 3:** As someone planning custom wood work, I want a page about indoor/outdoor custom carpentry, so that I can understand the scope and request a quote.

**Acceptance Criteria**
1. WHEN a visitor opens `/carpinteria-a-medida-guayaquil` THEN the system SHALL show Spanish content for custom indoor and outdoor wood craft.
2. WHEN a crawler reads the page THEN the system SHALL expose clear entities: business, service, area served, process, materials, and FAQs.
3. WHEN a visitor reaches the page from navigation or sitemap THEN the page SHALL be internally discoverable.

## Design

## Overview

Create three static, database-light Blade pages driven by a PHP config map. Each page targets one local search intent and returns server-rendered Spanish HTML, metadata, and JSON-LD for stronger crawler and AI-indexer readability.

## Architecture

- `LocalSeoPageController` resolves a slug to page data and renders `seo.service`.
- `routes/web.php` exposes three Spanish URLs and a dynamic `sitemap.xml`.
- `resources/views/seo/service.blade.php` renders the landing page, metadata, JSON-LD, FAQs, service area, process, and CTAs.
- `PublicHeader` links to the new pages so crawlers and users can discover them.

## Components and Interfaces

- Page data includes: slug, title, metaDescription, h1, intro, intent, heroImage, services, problems, process, areas, faqs, relatedLinks.
- JSON-LD includes: `LocalBusiness`, `Service`, `FAQPage`, and `BreadcrumbList`.
- Content is Spanish-first, with natural local keywords for Guayaquil, Samborondon, Daule, Via a la Costa, Urdesa, norte and sur.

## Decisions

### Decision: Three Dedicated Pages
**Context:** The request has three distinct intents.
**Options Considered:**
1. Single general SEO page - Pros: faster / Cons: weak intent match.
2. Three focused pages - Pros: better intent relevance and internal linking / Cons: slightly more code.
**Decision:** Three focused pages.
**Rationale:** Local SEO and AI indexing both benefit from clear, intent-specific pages with complete context.

### Decision: JSON-LD Mirrors Visible Content
**Context:** Google structured data policies require markup to match visible content.
**Decision:** Only mark up services, FAQs, and business details that are shown on-page.
**Rationale:** Avoids misleading structured data and keeps eligibility safer.

## Tasks

- [x] 1. Define SEO page requirements and data model.
- [x] 2. Create Laravel controller and route map for local SEO pages.
- [x] 3. Build Spanish Inertia page with metadata, local copy, FAQs, and structured data.
- [x] 4. Add internal links from navigation and sitemap.
- [x] 5. Verify formatting, TypeScript, and production build.
