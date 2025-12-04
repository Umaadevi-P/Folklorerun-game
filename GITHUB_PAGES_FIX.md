# GitHub Pages Asset Path Fix

## Problem
Assets (images, audio, JSON files) were not loading because paths were hardcoded as `/assets/` instead of using Vite's base URL configuration.

## Solution
Updated all asset references to use `import.meta.env.BASE_URL` which automatically prepends `/Folklorerun-game/` when deployed to GitHub Pages.

## Files Changed

### 1. src/utils/dataLoader.js
- Fixed JSON file paths for `creatures_game_data.json` and `ui_dynamic_config.json`

### 2. src/components/CharacterReveal.jsx
- Fixed creature image paths (e.g., "Baba Yaga.jpg")

### 3. src/components/IntroAnimation.jsx
- Fixed intro video path ("Intro.mp4")
- Fixed intro audio path ("intro audio.mp3")

### 4. src/App.jsx
- Fixed background audio path ("Background audio.mp3")
- Fixed creature-specific audio paths (e.g., "Baba Yaga audio.mp3")

### 5. src/components/HeroScene.jsx
- Fixed creature background image paths (e.g., "Baba Yaga BG.jpg")

### 6. src/components/EndCard.jsx
- Fixed creature image paths for end cards
- Fixed special defeated image for Aswang ("Aswang_defeated.jpg")

## How to Deploy

1. **Upload the changed files to GitHub:**
   - Go to each file in your repository
   - Click "Edit" (pencil icon)
   - Copy the updated content from your local files
   - Commit the changes

2. **The GitHub Actions workflow will automatically:**
   - Build your app with the correct base path
   - Deploy to GitHub Pages
   - Your site will be live at: https://Umaadevi-P.github.io/Folklorerun-game

## Testing Locally

To test that the base path works correctly:

```bash
npm run build
npm run preview
```

The preview will show you exactly how it will look when deployed.

## What Changed

**Before:**
```javascript
const imagePath = `/assets/${creature.name}.jpg`;
```

**After:**
```javascript
const imagePath = `${import.meta.env.BASE_URL}assets/${creature.name}.jpg`;
```

This ensures that:
- Locally: paths resolve to `/assets/...`
- On GitHub Pages: paths resolve to `/Folklorerun-game/assets/...`
