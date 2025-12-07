# Portfolio — Mouadh JABER

Site statique simple généré à partir du CV texte (CV_MJ_FR.txt). Conçu pour être responsive et optimisé pour le SEO. Ce dépôt contient un workflow GitHub Actions pour déployer automatiquement sur GitHub Pages.

## Structure proposée
- index.html — page principale
- assets/styles.css — styles
- assets/main.js — interactions JS minimales
- CV_MJ_FR.txt — fichier CV brut (existant)
- sitemap.xml
- robots.txt
- .github/workflows/pages-deploy.yml — workflow d'autodeploy

## Déploiement (GitHub Pages)
1. Poussez ces fichiers sur la branche `main` (ou votre branche principale).
2. Le workflow `.github/workflows/pages-deploy.yml` se déclenche à chaque push sur `main`. Il publiera le contenu sur la branche `gh-pages` et activera GitHub Pages via l'action officielle.
3. Après déploiement, votre site sera disponible à :
   `https://<votre-utilisateur>.github.io/<nom-du-repo>/`
   (ex : `https://mouadhjaber.github.io/mywebsite/`)

## Personnalisation SEO
- Modifiez les meta tags (title, description, canonical) dans `index.html`.
- Remplacez l'URL dans `sitemap.xml` par l'URL finale du site.
- Ajoutez des pages de projets si besoin (ex : `projects/xyz.html`) et mettez à jour `sitemap.xml`.

## Pousser automatiquement via moi
Si vous voulez que je pousse ces fichiers directement dans `Mouadhjaber/mywebsite`, dites-moi la branche cible (ex: `main`). Je peux préparer et exécuter le commit pour vous.

## Remarques de sécurité / confidentialité
- L'email est en clair pour faciliter le contact. Si vous préférez un formulaire avec backend, il faudra un serveur ou un service de formulaire (Formspree, Netlify Forms, etc.).
- Le workflow utilise uniquement actions officielles et GitHub Pages API. Aucun secret supplémentaire n'est nécessaire (GITHUB_TOKEN est utilisé).
