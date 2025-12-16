# Documentation Deployment

This documentation site is automatically deployed to GitHub Pages using GitHub Actions.

## Deployment Setup

### 1. Enable GitHub Pages

1. Go to your repository settings
2. Navigate to **Pages** under **Code and automation**
3. Under **Build and deployment**:
   - Source: **GitHub Actions**

### 2. Configuration

The deployment is configured with:

- **Base Path**: `/relay` (configured in `next.config.mjs`)
- **Static Export**: Enabled for GitHub Pages compatibility
- **Output Directory**: `out/`

### 3. Automatic Deployment

The site automatically deploys when:

- Changes are pushed to the `main` branch in:
  - `docs/**` - Documentation content or configuration
  - `package/**` - The Relay package source code
  - `.github/workflows/deploy-docs.yml` - Workflow configuration

### 4. Manual Deployment

You can manually trigger a deployment:

1. Go to **Actions** tab in GitHub
2. Select **Deploy Documentation Site**
3. Click **Run workflow**
4. Select the `main` branch
5. Click **Run workflow**

## Local Development

Build and preview the site locally:

```bash
# From the monorepo root
cd docs

# Install dependencies (if not already installed)
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm start
```

The site will be available at:
- Development: `http://localhost:3000`
- Production preview: `http://localhost:3000`

## Site URL

After deployment, the documentation will be available at:

```
https://<username>.github.io/relay/
```

Replace `<username>` with your GitHub username or organization name.

## Troubleshooting

### Build Failures

If the build fails:

1. Check the **Actions** tab for error logs
2. Verify the build works locally with `pnpm build`
3. Ensure all dependencies are properly listed in `package.json`

### 404 Errors on Deployed Site

If you get 404 errors:

1. Verify the `basePath: "/relay"` in `next.config.mjs` matches your repository name
2. Check that GitHub Pages is enabled and set to GitHub Actions
3. Ensure the workflow completed successfully

### Images Not Loading

If images aren't loading:

1. Verify `images.unoptimized: true` is set in `next.config.mjs`
2. Check image paths are relative and don't include `/relay` prefix
3. Ensure images are in the `public/` directory

## Cache Management

The workflow caches:

- pnpm dependencies
- Next.js build cache

To clear caches and force a fresh build:

1. Go to **Actions** → **Caches**
2. Delete relevant caches
3. Re-run the workflow
