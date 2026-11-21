# Kids Cartoon World

A colorful, mobile-friendly children's cartoon and storytelling website built with **React**, **TypeScript**, **Tailwind CSS**, **Vite**, and **Firebase** (Firestore + Google Sign-In for the owner-only admin dashboard).

---

## Project Structure

- `index.html` — Main HTML entry point, page metadata, and typography (`Outfit` & `Plus Jakarta Sans`)
- `src/index.css` — Tailwind CSS v4 styles and accessibility rules
- `src/main.tsx` & `src/App.tsx` — Application entry point and hash-based router (GitHub Pages compatible)
- `src/components/` — Responsive `Navbar`, `Footer`, `VideoCard`, `VideoPlayer`, and `ErrorBoundary`
- `src/pages/` — `HomePage`, `CategoryPage`, `VideoDetailPage`, `SearchPage`, `StaticPages` (About, Contact, Privacy, Terms), and `AdminDashboardPage`
- `src/data/sampleVideos.ts` — 8 clearly labeled original sample demo cartoons
- `src/assets/images/` — 8 original generated storybook cartoon thumbnails
- `src/lib/` & `src/services/` — Firebase SDK initialization, privacy-enhanced video URL parsers, and Firestore catalog/inquiry services
- `firebase-applet-config.json` & `firestore.rules` — Firebase web project configuration and Firestore security rules
- `.github/workflows/deploy-github-pages.yml` — Automatic free GitHub Pages build & deployment workflow
- `public/.nojekyll` — Ensures GitHub Pages serves built assets cleanly

---

## Free Hosting on GitHub Pages (Beginner / Android Phone Friendly)

This project is pre-configured with relative asset paths (`base: './'`), hash routing (`#/...`), and an automatic GitHub Actions deployment workflow so it works immediately on GitHub Pages at both `https://<your-username>.github.io/<repo-name>/` and custom domains.

### Step 1: Export Your Code & Upload to GitHub
1. In AI Studio, use **Download / Export** (or **Push to GitHub**) to save the complete project folder.
2. Create a new **Public** repository on [github.com](https://github.com) (for example, `kids-cartoon-world`) with default branch `main`.
3. Upload or push all project files (including `.github/workflows/deploy-github-pages.yml`, `index.html`, `package.json`, `vite.config.ts`, `firebase-applet-config.json`, `public/`, and `src/`) to the `main` branch.

### Step 2: Enable GitHub Pages (Free)
1. Open your repository on GitHub and tap **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Open the **Actions** tab: the **Deploy Kids Cartoon World to GitHub Pages** workflow will run automatically (or tap **Run workflow** manually).
4. In about 1–2 minutes, your live website URL will appear:
   `https://<your-username>.github.io/<your-repo-name>/`

### Step 3: Allow Owner Sign-In on Your GitHub Pages Domain
Because your Owner Admin Dashboard uses Firebase Google Sign-In, add your new GitHub Pages domain to Firebase once:
1. Open the [Firebase Console](https://console.firebase.google.com/) and select your project (`gen-lang-client-0487138249`).
2. Go to **Authentication → Settings → Authorized domains**.
3. Tap **Add domain** and enter `<your-username>.github.io` (without `https://` or any path).
4. Now **Owner Sign In** at the bottom of your live GitHub Pages site will work seamlessly from your Android phone!

### Step 4 (Optional): Connect a Custom Domain
1. In your GitHub repository, go to **Settings → Pages → Custom domain** and enter your domain (e.g., `www.kidscartoonworld.com`).
2. Follow GitHub's DNS instructions at your domain registrar and enable **Enforce HTTPS**.
3. Add your custom domain in **Firebase Console → Authentication → Settings → Authorized domains** as well.

---

## Local Development & Manual Static Build

```bash
npm install
npm run dev      # Start local dev server on http://localhost:3000
npm run build    # Build production HTML, CSS, JS, and images into ./dist
npm run preview  # Preview the built ./dist site locally
```

The built `./dist` folder contains pure static HTML, CSS, JavaScript, and images that can be hosted on GitHub Pages, Cloudflare Pages, Netlify, or any static web host.
