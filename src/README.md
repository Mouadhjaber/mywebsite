# Mouadh Jaber — Professional Portfolio

A futuristic engineering portfolio built with semantic HTML, CSS, and vanilla JavaScript. Six UN-language support, working PDF download, and complete SEO.

## Live Site
https://mouadhjaber.com/

## Project Structure

```
src/
├── index.html                  # English portfolio (main entry)
├── full-cv.html                # English full CV (raw text from DOCX)
├── cv-neo.html                 # Classic Neo-Futurist CV (PDF-optimized)
├── cv-neo.css                  # Neo-futurist CV styling
├── styles.css                  # Main stylesheet (responsive + neo-futurist)
├── sitemap.xml                 # SEO sitemap (all languages)
├── robots.txt                  # Search engine directives
├── CNAME                       # mouadhjaber.com
├── CV_MJ_EN.docx               # Source CV (single source of truth)
├── vendor/
│   └── html2pdf.bundle.min.js  # PDF generation library (kept for reference)
├── assets/
│   └── profile.jpg             # Profile image
├── fr/                         # French portfolio
│   ├── index.html
│   └── full-cv.html
├── ar/                         # Arabic (RTL)
│   ├── index.html
│   └── full-cv.html
├── es/                         # Spanish
│   ├── index.html
│   └── full-cv.html
├── zh/                         # Chinese
│   ├── index.html
│   └── full-cv.html
└── ru/                         # Russian
    ├── index.html
    └── full-cv.html
```

## Key Features

### 1. Six UN Languages
English, French, Arabic, Spanish, Chinese, Russian. Each language has its own page under `/fr/`, `/ar/`, `/es/`, `/zh/`, `/ru/`. Arabic uses RTL layout (`dir="rtl"`).

### 2. PDF Download
Clicking **Download PDF** opens `/cv-neo.html?pdf=1`, which triggers `window.print()` for a clean, print-optimized PDF output. The CV page (`cv-neo.html`) uses:
- Classic CV format with neo-futurist architecture styling
- Clean white background, crisp typography (Georgia serif)
- No borders, comfortable margins (20mm)
- Professional page breaks (roles never split across pages)
- Optimized for A4 portrait

### 3. SEO
- Canonical URLs on all pages
- Hreflang tags for all 6 languages + x-default
- Open Graph meta tags (title, description, image, type)
- Twitter Card tags (summary_large_image)
- JSON-LD structured data (Person, WebSite, ProfilePage, BreadcrumbList)
- Schema.org `knowsAbout`, `knowsLanguage`, `sameAs`, `alumniOf`
- `robots.txt` with sitemap reference
- `sitemap.xml` with all language variants
- Theme-color meta tag
- Meta keywords and author tags

### 4. Responsive Design
- Mobile-first breakpoints at 800px and 480px
- Hamburger menu on mobile (`< 800px`)
- Adaptive grid layouts (4-col → 2-col → 1-col)
- Touch-friendly buttons (min 44px)
- Scalable typography with `clamp()`
- Language switcher remains visible on mobile

### 5. Neo-Futurist Design
- Dark futuristic theme (`#071315` paper, `#8cf4cf` accent, `#ff704d` hot)
- Radial gradient backgrounds
- Subtle grid pattern overlay
- Glassmorphism header with backdrop-filter blur
- Geometric accent lines and borders

## File: CV_MJ_EN.docx

The original DOCX CV is the single source of truth. All position descriptions are transcribed from it — no invented achievements. .NET appears only in the technology list; positioning is generic (critical systems, architecture, secure integration, AI/LLM integration, reliable delivery).

## Deployment

The site is deployed via GitHub Pages from the `src/` directory. Push to `main` triggers automatic deployment.

## Local Development

```bash
cd src
python3 -m http.server 8765
# Visit http://127.0.0.1:8765
```

## PDF Generation

The PDF is generated natively by the browser via `window.print()` on `/cv-neo.html?pdf=1`. This produces:
- A4 portrait format
- 20mm margins
- No text touching borders
- Clear, justified text
- Role blocks never split across pages

## Contact

- Email: mouadh.jaber@msn.com
- Phone: +216 58 201 430
- WhatsApp: https://wa.me/21658201430
- LinkedIn: https://www.linkedin.com/in/mouadhjaber/
