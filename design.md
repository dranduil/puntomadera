# Punto Madera — Design Guide

## Brand Style

Punto Madera is a minimalist wood and interior design brand from Guayaquil, Ecuador.  
The visual style should feel warm, natural, elegant, artisanal, and premium without becoming too luxurious or cold.

The brand should communicate:

- Natural craftsmanship
- Clean modern interiors
- Warmth and trust
- Simplicity
- Quality materials
- Timeless design
- Calm Ecuadorian coastal elegance

The design should avoid visual noise. Use space, soft contrast, rounded shapes, and wood-inspired textures.

---

## Logo Direction

Use a minimalist monogram based on the letters **P** and **M**.

Recommended logo style:

- Lowercase brand name: `punto madera`
- Wide letter spacing
- Thin modern typography
- Wood grain detail inside the monogram
- Dark brown primary logo
- Light beige or off-white background
- Optional location line: `GUAYAQUIL · ECUADOR`

Logo variations:

1. Full logo with monogram + wordmark + location
2. Monogram only
3. Circular stamp logo
4. White logo on dark brown background
5. Dark brown logo on light background

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|---|---:|---|
| Deep Wood Brown | `#3B2C20` | Main logo, headings, primary buttons, footer |
| Warm Walnut | `#8B6F4E` | Secondary accents, hover states, icons |
| Natural Sand | `#CDBAA2` | Cards, borders, backgrounds, subtle sections |
| Soft Linen | `#F2EDE6` | Main background, UI panels |
| Ivory White | `#FAF8F5` | Page background, cards, clean space |

### Extended UI Colors

| Name | Hex | Usage |
|---|---:|---|
| Charcoal Text | `#2A211A` | Body text and strong labels |
| Muted Taupe | `#8A7B6C` | Captions, metadata, secondary text |
| Border Beige | `#E4D8CA` | Input borders, dividers, card outlines |
| Success Soft Green | `#EAF4EC` | Success alerts |
| Warning Soft Amber | `#FFF3DA` | Warning alerts |
| Error Soft Rose | `#FDEAEA` | Error alerts |

---

## CSS Color Tokens

```css
:root {
  --color-wood-deep: #3B2C20;
  --color-walnut: #8B6F4E;
  --color-sand: #CDBAA2;
  --color-linen: #F2EDE6;
  --color-ivory: #FAF8F5;

  --color-text: #2A211A;
  --color-text-muted: #8A7B6C;
  --color-border: #E4D8CA;

  --color-success-bg: #EAF4EC;
  --color-warning-bg: #FFF3DA;
  --color-error-bg: #FDEAEA;
}
```

---

## Typography

### Primary Font

Use **Poppins**.

Recommended weights:

- Light: 300
- Regular: 400
- Medium: 500
- SemiBold: 600

Poppins works well because it is clean, geometric, modern, and minimalist. It supports the refined spacing used in the logo.

### Alternative Fonts

If Poppins is not available, use:

```css
font-family: "Poppins", "Inter", "Montserrat", Arial, sans-serif;
```

### Typography Scale

| Element | Font | Size | Line Height | Weight | Color |
|---|---|---:|---:|---:|---|
| H1 | Poppins | 48px | 56px | 600 | `#3B2C20` |
| H2 | Poppins | 32px | 40px | 500 | `#3B2C20` |
| H3 | Poppins | 24px | 32px | 500 | `#3B2C20` |
| Body | Poppins | 16px | 26px | 400 | `#2A211A` |
| Small | Poppins | 14px | 22px | 400 | `#8A7B6C` |
| Caption | Poppins | 12px | 16px | 400 | `#8A7B6C` |

### Logo Wordmark Style

```css
.logo-wordmark {
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  letter-spacing: 0.38em;
  text-transform: lowercase;
}
```

---

## Layout Style

Use a clean editorial grid.

Recommended structure:

- 12-column desktop grid
- 24px gutters
- 80px page margin on desktop
- 24px page margin on tablet
- 16px page margin on mobile
- Large whitespace between sections
- Soft cards with very light shadows
- Subtle beige borders

The website should feel like a premium showroom, not a busy ecommerce store.

---

## Buttons

### Primary Button

Use for main calls to action.

```css
.button-primary {
  background: #3B2C20;
  color: #FAF8F5;
  border-radius: 6px;
  padding: 12px 22px;
  font-weight: 500;
}
```

Hover:

```css
.button-primary:hover {
  background: #8B6F4E;
}
```

### Secondary Button

```css
.button-secondary {
  background: transparent;
  color: #3B2C20;
  border: 1px solid #8B6F4E;
  border-radius: 6px;
  padding: 12px 22px;
}
```

### Text Button

Use for subtle navigation actions.

```css
.button-text {
  color: #3B2C20;
  text-decoration: none;
}
```

---

## Components

### Navigation

Style:

- Minimal horizontal navbar
- Logo on the left
- Menu links centered or right-aligned
- A simple menu icon where needed on smaller screens
- Light background with subtle shadow or border

Example links:

- Inicio
- Servicios
- Trabajos
- Contacto

---

### Service and project cards

Service and project cards should use:

- Rounded corners: 8px to 12px
- Light background: `#FAF8F5`
- Thin border: `#E4D8CA`
- Large project image when available
- Small category label
- Service or project name
- Short description
- Arrow icon for details

Card style should be clean and quiet. Let the wood textures and project photos carry the emotion.

---

### Hero Section

Recommended hero direction:

- Large lifestyle image of furniture, wood panels, or interior spaces
- Warm natural lighting
- Short emotional headline
- Small descriptive paragraph
- Primary CTA button

Example headline:

> Madera que transforma tu espacio.

Example subtext:

> Diseñamos piezas y espacios cálidos, funcionales y auténticos para hogares y proyectos en Guayaquil.

---

### Forms and Inputs

Inputs should be simple and soft.

```css
.input {
  background: #FAF8F5;
  border: 1px solid #E4D8CA;
  border-radius: 6px;
  padding: 12px 14px;
  color: #2A211A;
}
```

Active state:

```css
.input:focus {
  border-color: #8B6F4E;
  outline: none;
}
```

---

### Badges and Tags

Use soft pill badges.

Examples:

- Nuevo
- Más vendido
- A medida
- Sostenible
- Roble
- Nogal
- Natural

```css
.badge {
  background: #F2EDE6;
  color: #3B2C20;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
}
```

---

## Imagery Direction

Use photography with:

- Natural daylight
- Warm interiors
- Wood grain close-ups
- Neutral walls
- Green plants
- Handcrafted details
- Calm domestic scenes
- Premium but accessible styling

Avoid:

- Overly saturated colors
- Cold gray corporate spaces
- Heavy shadows
- Busy backgrounds
- Cheap stock-photo style

---

## Iconography

Use thin-line icons.

Recommended style:

- 1.5px stroke
- Rounded ends
- No filled icons unless active
- Simple geometric shapes
- Dark brown or walnut color

Icon examples:

- Home
- Search
- User
- Cart
- Heart
- Mail
- Phone
- Location
- Menu
- Leaf

---

## UI Personality

The interface should feel:

- Calm
- Warm
- Organized
- Premium
- Natural
- Trustworthy
- Minimal
- Easy to browse

Avoid:

- Neon colors
- Heavy gradients
- Overly playful typography
- Complex animations
- Aggressive sales banners
- Cluttered ecommerce layouts

---

## Animation Style

Use soft and slow animations.

Recommended:

- Fade in
- Gentle slide up
- Button hover transitions
- Image zoom on hover
- Smooth page transitions
- Subtle parallax for wood texture or hero imagery

Timing:

```css
transition: all 220ms ease;
```

Avoid fast, flashy, or chaotic motion.

---

## Website Sections

Recommended homepage structure:

1. Hero
2. Custom furniture / made-to-measure section
3. Projects gallery
4. Material quality section
5. About Punto Madera
6. Testimonials
7. Contact / quotation
8. Footer

---

## Voice and Copy Style

Tone should be simple, warm, and confident.

Use phrases like:

- Diseño que conecta.
- Madera que perdura.
- Hecho para transformar espacios.
- Detalles que hacen la diferencia.
- Natural, cálido y funcional.
- Diseñado en Guayaquil, hecho para durar.

Avoid exaggerated claims. The brand should speak with quiet confidence.

---

## Footer Direction

Footer should include:

- Logo
- Short brand description
- Service and project links
- Contact links
- Contact info
- Newsletter field
- Social icons
- Location: Guayaquil, Ecuador

Example short description:

> Diseñamos y fabricamos muebles que conectan hogares y espacios con calidez, función y autenticidad.

---

## Final Design Principle

Punto Madera should look like a brand that respects tradition, material, and craftsmanship, while presenting itself through a modern digital experience.

The brand is not loud.  
It is calm, grounded, refined, and durable.
