# Minimal Data Engineering Portfolio (Azure Static)
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


## Customize

### 1) Update links
   - Edit `index.html`: GitHub / LinkedIn / Email

### 2) Update projects
   - Edit `assets/data/projects.json`: - `title`, `blurb`, `tags`, `repo`, `readme`, `image`
   - **NOTE:** If you change `projects.json`, refresh with a hard reload to bypass cached content.

### 3) Swap images (optional)
   - Replace `assets/img/*.img` with: PNG/JPG screenshots (update `image` paths in JSON)


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
      
