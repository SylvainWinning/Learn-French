# Learn-French

Prototype React app for learning French.

## Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Build for production (used by GitHub Pages):

```bash
npm run build
```

After pushing to `main`, GitHub Actions runs `pages.yml` to build and deploy.
If the deployed page only shows the repository name, make sure the workflow
completed successfully and that Pages is configured to use **GitHub Actions**
as its source. You can check the build logs in the repository's **Actions** tab.

If dependency installation fails with a `403 Forbidden` error, ensure npm is
using the public registry and no proxy is interfering. The included `.npmrc`
forces the default registry and clears proxy settings.
