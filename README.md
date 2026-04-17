# Festival — Missions

Application web de missions festival, utilisable en mode local ou avec backend central Supabase.

## Ce qui est prêt

- Application participant: `index.html`
- Interface orga/backoffice: `orga.html`
- Web app installable (PWA): `manifest.webmanifest`, `sw.js`
- Fallback GitHub Pages: `404.html`, `.nojekyll`
- Setup backend: `SUPABASE_SETUP.md`

## Mise en ligne sur GitHub Pages

1. Publier ce dossier dans un repository GitHub (branche `main`).
2. Dans le repo GitHub: `Settings` -> `Pages`.
3. Source: `Deploy from a branch`.
4. Branch: `main`, dossier: `/ (root)`.
5. Attendre 1 a 3 minutes.

URL finale:

`https://<votre-username>.github.io/<nom-du-repo>/`

## Utilisation

- Participants: ouvrir `index.html` (ou l'URL GitHub Pages)
- Orga: ouvrir `orga.html` pour configurer le backend et publier/importer l'etat central

## Backend Supabase (optionnel mais recommande)

Suivre les etapes de `SUPABASE_SETUP.md`:

1. Creer la table `festival_state` dans Supabase.
2. Recuperer l'URL du projet et la cle anon.
3. Dans `orga.html`, configurer le mode `Supabase (central)`.
4. Publier une premiere fois vers le backend.

Ensuite, `index.html` lit automatiquement cette configuration depuis le navigateur.

Une fois Supabase configure avec l'authentification e-mail OTP, l'app peut aussi recuperer le code admin via le bouton `Code oublie ?`.

## PWA (installation mobile/desktop)

Depuis le site publie:

- Chrome/Edge desktop: menu navigateur -> `Installer l'application`
- Android: `Ajouter a l'ecran d'accueil`
- iOS Safari: `Partager` -> `Sur l'ecran d'accueil`

## Notes

- Les donnees sensibles ne doivent pas rester avec des policies ouvertes en production.
- Renforcer les policies Supabase avant un usage public large.
