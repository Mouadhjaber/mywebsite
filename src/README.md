# Mouadh Jaber — Multi-language Resume Website (Static)

## What you get
- Responsive one-page website (EN / FR / AR)
- SEO basics: meta tags, OpenGraph, Schema.org (Person), hreflang, robots.txt, sitemap.xml
- Client-side search over skills + experience
- Google Search Console + Bing Webmaster Tools verification placeholders

## Deploy (easy options)
### GitHub Pages
1) Create a repo and push all files in this folder to the repo root
2) In GitHub → Settings → Pages → Deploy from branch (main) / root
3) Update `robots.txt` + `sitemap.xml` with your real domain

### Netlify
- Drag & drop this folder in Netlify (or connect repo).
- Set build command: none (static)
- Publish directory: this folder

## Add your verification codes
Edit `index.html`:
- `google-site-verification`
- `msvalidate.01`

## Replace CV download
- Put your PDFs in the root, e.g. `cv-en.pdf`, `cv-fr.pdf`, `cv-ar.pdf`
- Update the `#cv-link` behavior in `app.js` (or keep Arabic Markdown link)

