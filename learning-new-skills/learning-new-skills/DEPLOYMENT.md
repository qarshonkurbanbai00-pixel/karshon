# Publish SKILLSPACE

## GitHub

1. Extract this ZIP on your computer.
2. Open https://github.com/new and create an empty repository named `learning-new-skills`.
3. In your new repository, choose **Add file → Upload files**.
4. Upload the contents of the extracted `learning-new-skills` folder. `package.json` must be at the repository root, alongside `index.html`, `src/`, `public/`, and the configuration files. Do not upload the ZIP itself or a `node_modules` folder.
5. Commit the files.

The tested `dist/` directory is included for immediate static publishing. It is optional in GitHub because Vercel builds the app from source.

## Vercel

1. Open https://vercel.com/new and sign in with GitHub.
2. Import your new repository.
3. Confirm these settings:
   - Framework preset: **Vite**
   - Root directory: the folder with `package.json` (normally the repository root)
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node.js version: **22.x**
   - Environment variables: **none**
4. Click **Deploy**.
5. Open the HTTPS URL Vercel provides. Future GitHub commits trigger new deployments.

The included `vercel.json` supplies the framework, build, output, and asset-cache settings. This website uses page-section links instead of client-side route paths, so no routing rewrites are needed.

## Local preview

Install Node.js 22.12 or newer, then run from the project folder:

```sh
npm install
npm run dev
```

To test the production version:

```sh
npm run build
npm run preview
```

Open the HTTP address printed by Vite. Do not open `index.html` by double-clicking it: ES modules need a web server. No backend, paid service, external assets, or API key is required.

## Publish the included built files elsewhere

For any static host, upload the **contents of `dist/`**, preserving `assets/` and the other files. The host must serve `index.html` as the home page. Use the GitHub import method above for Vercel.
