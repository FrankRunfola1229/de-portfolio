# Minimal Data Engineering Portfolio (Azure Static)

## Description
A tiny, minimalist portfolio site for showcasing my Azure data engineering projects.

## Why this layout
  - **Low coupling** : project content lives in `projects.json`
  - **Separation of duties** : HTML/CSS/JS/data/images are independent
  - **Easy updates**:  add a project by editing a single JSON file

A tiny, calm, minimalist portfolio site for showcasing Azure data engineering projects.
No build step. Clean separation:
- `index.html` and `pyspark.html` = structure
- `assets/css/*.css` = styles
- `assets/js/*.js` = logic
- `assets/data/*.json` = content
- `assets/img/*` = images

## Pages
- Home: `index.html`
- PySpark learning page: `pyspark.html`

## Update content
### Projects
Edit `assets/data/projects.json`:
- `title`, `blurb`, `tags`, `repo`, `readme`, `image`

Images are referenced as paths like:
- `assets/img/weather.png`

### PySpark snippets
Edit `assets/data/pyspark_snippets.json`:
- `title`, `note`, `code`

## Deploy to Azure (cheapest): Storage Static Website
1. Create an Azure Storage Account
2. Enable **Static website**
   - Index document: `index.html`
3. Upload everything to `$web` preserving folder structure:
   - `index.html`, `pyspark.html`, and `assets/`
4. Open the static website endpoint

## Notes
- If you update JSON and don’t see changes, hard refresh (cache).
- Navbar is shared by copy/paste + `assets/js/nav.js` highlights active page and provides Back behavior.


<br>

## Deploy to GitHub Pages
### Push to GitHub

```
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://frankrunfola1229.github.io/de-portfolio/
git push -u origin main
```

### Turn on GitHub Pages
  0. Verify Folder Structure
     - /index.html
     - /assets/css/styles.css
     - /assets/js/app.js
     - /assets/data/projects.json
  1. Go to your repo on GitHub
  2. Settings → Pages
  3. Under Build and deployment
     - Source: Deploy from a branch
     - Branch: `main`
     - Folder: `/ (root)`
  4. Click Save
  5.Verify Deployment
     - Open in browser: **https://frankrunfola1229.github.io/de-portfolio/
  5. Test it locally first (so you don’t debug in production)
     - Run a tiny local server: ```python -m http.server 8080```
  6. Common gotchas
     - Case sensitivity: GitHub Pages is Linux. Assets/ is NOT the same as assets/.
     - Wrong README link in JSON: readme: 
       - "README.md" won’t work on Pages unless that file exists at **/de-portfolio/README.md**
     - CORS / blocked icons: Your Azure icons come from external URLs. If one doesn’t load, download the PNGs into assets/img/azure/ and reference locally (more reliable).
<br>


