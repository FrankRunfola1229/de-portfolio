# Minimal Data Engineering Portfolio (Azure Static)

## Description
A tiny, minimalist portfolio site for showcasing my Azure data engineering projects.

## Why this layout
  - **Low coupling** : project content lives in `projects.json`
  - **Separation of duties** : HTML/CSS/JS/data/images are independent
  - **Easy updates**:  add a project by editing a single JSON file

## Folder Structure
```
portfolio-site/
  index.html          # structure
  README.md
  assets/
    css/
      styles.css
    js/
      app.js          # logic (renders projects)
    data/
      projects.json   # content
    img/              # project images
      weather.svg
      bankrisk.svg
      quake.svg
      favicon.svg
```
<br>

## Customize

### 1) Update links
  - Edit `index.html`: GitHub / LinkedIn / Email

### 2) Update projects
  - Edit `assets/data/projects.json`: - `title`, `blurb`, `tags`, `repo`, `readme`, `image`
  - **NOTE:** If you change `projects.json`, refresh with a hard reload to bypass cached content.

### 3) Swap images (optional)
  - Replace `assets/img/*.img` with: PNG/JPG screenshots (update `image` paths in JSON)

<br>

## Deploy to GitHub Pages
### Push to GitHub
```git
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/<YOUR_USER>/<YOUR_REPO>.git
git push -u origin main
```

### Turn on GitHub Pages

  1. Go to your repo on GitHub
  2. Settings → Pages
  3. Under Build and deployment
    - Source: Deploy from a branch
    - Branch: main
    - Folder: / (root)
  4. Click Save
    GitHub will give you a URL like:
    https://<YOUR_USER>.github.io/<YOUR_REPO>/
  5. Test it locally first (so you don’t debug in production)
     - Run a tiny local server: ```python -m http.server 8080```
  6. Common gotchas
     - Case sensitivity: GitHub Pages is Linux. Assets/ is NOT the same as assets/.
     - Wrong README link in JSON: readme: "README.md" won’t work on Pages unless that file exists at /<repo>/README.md. Use full GitHub URL or leave blank.
     - CORS / blocked icons: Your Azure icons come from external URLs. If one doesn’t load, download the PNGs into assets/img/azure/ and reference locally (more reliable).
<br>

## Deploy to Azure (Storage Static Website)

  1. Push repo to GitHub
  2. Azure Portal → Create Static Web App (Standard / LRS is fine)
  3. connect to GitHub repo/branch
    - Index document name: `index.html`
    - `assets/` folder (keep structure)
  5. App location: `/`
  6. Output location: `/`
      - Azure uses GitHub Actions to build/deploy.
  7. Open the static website endpoint URL provided by Azure
      
