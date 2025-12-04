# GitHub Pages Deployment Guide

## Configuration Complete ✓

Your project is now configured for GitHub Pages deployment!

- **Live URL**: https://Umaadevi-P.github.io/Folklorerun-game
- **Repository**: https://github.com/Umaadevi-P/Folklorerun-game

## Step-by-Step Deployment Instructions

### 1. Install gh-pages package

```bash
npm install --save-dev gh-pages
```

### 2. Create GitHub Repository

Go to GitHub and create a new repository:
- Repository name: `Folklorerun-game`
- Make it public (required for free GitHub Pages)
- Don't initialize with README (you already have one)

### 3. Initialize Git and Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Folklorerun game"
git branch -M main
git remote add origin https://github.com/Umaadevi-P/Folklorerun-game.git
git push -u origin main
```

### 4. Deploy to GitHub Pages

```bash
npm run deploy
```

This command will:
- Build your app (`npm run build`)
- Create a `gh-pages` branch
- Push the built files to that branch
- GitHub will automatically host it

### 5. Enable GitHub Pages (if needed)

If the site doesn't appear after a few minutes:
1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll to "Pages" in the left sidebar
4. Under "Source", select `gh-pages` branch
5. Click "Save"

### 6. Access Your Live Site

After 2-5 minutes, your game will be live at:
**https://Umaadevi-P.github.io/Folklorerun-game**

## Updating Your Deployed Site

Whenever you make changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
npm run deploy
```

## Troubleshooting

**Assets not loading?**
- Make sure all asset paths are relative (starting with `./` or `/`)
- The `base` path in `vite.config.js` is already configured

**404 errors?**
- Wait 5-10 minutes after first deployment
- Check that GitHub Pages is enabled in repository settings
- Verify the `gh-pages` branch exists

**Need to test locally first?**
```bash
npm run build
npm run preview
```

This will show you exactly how it will look when deployed.
