# de-portfolio
My Personal DE Portfolio

## High-level Components
1. Graphical “Medallion” pipeline diagram
2. Project cards generated from JSON (so updating projects is trivial)
3. Interactive charts (Chart.js via CDN)
4. “Transparency” (cost, quality checks, SLAs, runbooks, lineage)


## High level steps

1. Create a GitHub repo (example: de-portfolio)
2. Add the files below and push to main
3. In Azure Portal → create Static Web App → connect to GitHub repo/branch
4. App location: / (root). Output location: leave blank (it’s plain HTML)
5. Azure auto-generates a GitHub Actions workflow to deploy. 


## Folder Structure
```
portfolio-site/
  index.html
  README.md
  assets/
    css/
      styles.css
    js/
      app.js
    data/
      projects.json
    img/
      weather.svg
      bankrisk.svg
      quake.svg
      favicon.svg

```

## Deploy instructions (copy/paste practical)
If you choose Azure Static Web Apps (recommended)
  - Push repo to GitHub
  - Azure Portal → Create Static Web App
  - Deployment source: GitHub
  - Branch: main
  - App location: /
  - Output location: (blank)
    - Azure uses GitHub Actions to build/deploy. 
