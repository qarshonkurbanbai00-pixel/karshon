# SKILLSPACE — Learning New Skills

A finished, responsive learning website built with React, Vite, Three.js / React Three Fiber, Tailwind CSS, and Framer Motion. All website copy uses clear B1–B2 English.

## Requirements

Use Node.js 22.12 or later (Node.js 22 LTS recommended) and npm. No API keys, accounts, paid services, or environment variables are needed.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To make and test a production build:

```sh
npm run build
npm run preview
```

`dist/` is the publish-ready static website. A tested production build is included in this archive. Rebuild it after changing source files. The lockfile is included; use `npm ci` for an exact dependency install.

## Upload to GitHub and deploy on Vercel

1. Extract the ZIP. The folder containing `package.json` is the project root.
2. Create a new empty GitHub repository, for example `learning-new-skills`.
3. In GitHub, select **Add file → Upload files**. Upload the contents of the project folder, including `src`, `public`, `package.json`, `package-lock.json`, `index.html`, and the configuration files. Do not upload `node_modules`. The included `dist` folder is optional for GitHub; Vercel rebuilds it.
4. Commit the upload. If using Git instead, run these commands from the project root, replacing YOUR-USERNAME:

```sh
git init
git add .
git commit -m "Launch SKILLSPACE"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/learning-new-skills.git
git push -u origin main
```

5. Sign in to Vercel with GitHub. Choose **Add New → Project**, then import the repository.
6. Select **Vite** if it is not detected. Keep the root directory as the folder containing `package.json`. Build command: `npm run build`. Output directory: `dist`. Select Node.js 22.x in project settings if needed. No environment variables are required.
7. Click **Deploy**. Vercel provides your live HTTPS URL. Future pushes to `main` create new deployments automatically.

`vercel.json` sets the framework, build command, output directory, and long-lived caching for hashed assets. All navigation uses in-page anchors, so no SPA route rewrite is needed.

## Included experiences

- Welcome with an original, procedural 3D orbital sculpture. Drag to turn it; select a node to explore its skill. Arrow keys turn the model when its viewport is focused. A pause button stops automatic rotation.
- Why learning matters: confidence, new options, and stronger problem-solving.
- Six skill areas with detail panels and a real “Add to my roadmap” action.
- Four learning challenges with expandable practical advice.
- Four-week roadmap with saved completion steps and skill selection. Progress stays in this browser. Use Reset to clear the checklist.
- Five-question quiz with immediate explanations, progress, results, review, and retry.
- Closing section and working back-to-top navigation.

## Project structure

```text
src/
  main.jsx
  App.jsx
  data.js
  styles.css
  components/
    Universe.jsx
    Quiz.jsx
    Roadmap.jsx
public/
  favicon.svg
  robots.txt
index.html
package.json
package-lock.json
vite.config.js
tailwind.config.js
postcss.config.js
vercel.json
README.md
TESTING.md
dist/                 tested production build
```

## Assets and performance

All 3D geometry, particles, materials, SVG decorations, and the favicon are made in code and ship with this project. There are no external 3D models, images, remote fonts, tracking scripts, or missing asset downloads. Icons come from the bundled `lucide-react` dependency (ISC license). React, Vite, Tailwind CSS, Framer Motion, React Three Fiber, and Three.js retain their original open-source licenses in their packages.

The 3D scene is loaded separately, limits pixel ratio to 1.5, pauses its render loop when off-screen or when the browser tab is hidden, and uses low-poly geometry and shared geometry/materials. A static CSS orbit scene appears while loading and on devices without WebGL. Large dependency bundles are separated and hashed by Vite. Reduced-motion settings disable decorative motion and automatic rotation.

## Accessibility and privacy

Includes semantic landmarks, a skip link, visible focus rings, descriptive labels, keyboard-accessible controls, native disclosure panels, live quiz feedback, and a non-WebGL fallback. All controls remain usable without the 3D scene. No data is sent to any server; roadmap state is stored only in localStorage. If browser storage is blocked, the app still works for the current session. Clear site data or use the reset control to clear the checklist.

## Editing

- `src/data.js`: skill areas, four-week plans, challenge advice, and quiz questions.
- `src/styles.css`: palette, layout, effects, and responsive rules.
- `src/components/Universe.jsx`: procedural Three.js scene.
- `src/App.jsx`: page sections and navigation.

This is a static educational experience, not a course platform. No login, payment, or backend is required. All actions are implemented locally and no service credentials need to be added.
