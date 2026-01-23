# de-portfolio — Azure Data Engineering Portfolio (Static Site)

This repo is a **no-build, static** portfolio site for showcasing Azure data engineering projects, training notes, and hands-on labs.

It’s intentionally simple:
- **No framework**
- **No bundler**
- **No build step**
- **Content is data-driven** (JSON) so you can update the site without touching JS/HTML much.

<br>

## Pages

- **Home**: `index.html`
- **Projects**: `projects.html`
- **Labs (hub)**: `labs.html`
  - **PySpark Labs**: `labs-pyspark.html`
- **Training (hub)**: `training.html`
  - **PySpark**: `training-pyspark.html`
  - **SQL**: `training-sql.html`
  - **Data Modeling**: `training-modeling.html`

> Note: `training-pyspark-labs.html` is kept as a compatibility redirect so older links don’t break.

<br>

## Folder structure

```
/                         # repo root (GitHub Pages serves from here)
├─ index.html             # landing page (intro + quick links)
├─ projects.html          # projects gallery (JSON-driven)
├─ labs.html              # labs hub page
├─ labs-pyspark.html      # PySpark labs page (JSON-driven)
├─ training.html          # training hub page
├─ training-pyspark.html  # PySpark training/snippets (JSON-driven)
├─ training-sql.html      # SQL training/snippets (JSON-driven)
├─ training-modeling.html # data modeling training/snippets (JSON-driven)
│
└─ assets/                # everything shared across pages
   ├─ css/
   │  ├─ styles.css       # global site styles (layout, cards, typography)
   │  └─ pyspark.css      # PySpark-specific tweaks (kept consistent with site width)
   │
   ├─ js/
   │  ├─ layout.js        # injects navbar/backbar/footer into all pages
   │  ├─ shared.js        # shared helpers: fetch JSON, nav/back behavior, utilities
   │  ├─ home.js          # renders home page “service pills”
   │  ├─ app.js           # renders project cards into #projectsGrid
   │  ├─ pyspark-labs.js  # renders labs into #labsGrid
   │  ├─ pyspark.js       # renders PySpark snippets into #snippetsGrid
   │  ├─ sql.js           # renders SQL snippets into #snippetsGrid
   │  └─ modeling.js      # renders modeling snippets into #snippetsGrid
   │
   ├─ data/                     # data that drives the UI (edit these most often)
   │  ├─ projects.json          # project cards content
   │  ├─ pyspark_labs.json      # lab cards content (PySpark)
   │  ├─ pyspark_snippets.json  # training snippets (PySpark)
   │  ├─ sql_snippets.json      # training snippets (SQL)
   │  ├─ modeling_snippets.json # training snippets (data modeling)
   │  └─ files/
   │     ├─ cv.pdf             # downloadable resume/CV
   │     └─ diploma.png        # credential image
   │
   └─ img/
      ├─ favicon.svg      # modern favicon
      └─ ...              # project images referenced by projects.json
```

<br>

## How the site works

### Shared layout (navbar/back button/footer)
Every page (except legacy `pyspark.html`) uses:
- `<div id="siteHeader"></div>`
- `<div id="siteBackbar"></div>`
- `<footer id="siteFooter"></footer>`

…and `assets/js/layout.js` injects the actual HTML so you don’t copy/paste nav markup everywhere.

Each page controls behavior with `<body>` data attributes:
- `data-show-back="0|1"`: show/hide the Back bar
- `data-page="..."`: used for nav highlighting
- `data-footer-right="..."`: footer right-hand label

### Data-driven content (JSON → cards)
The UI content is stored in JSON files under `assets/data/`:

**Projects** → `assets/data/projects.json`
- Add a new project by adding one object (title, blurb, tags, links, image, etc.).
- Images live in `assets/img/` and are referenced by relative path.

**Training snippets**
- PySpark: `assets/data/pyspark_snippets.json`
- SQL: `assets/data/sql_snippets.json`
- Modeling: `assets/data/modeling_snippets.json`

**Labs**
- PySpark labs: `assets/data/pyspark_labs.json`

The JS page files read JSON and render cards into:
- `#projectsGrid`
- `#snippetsGrid`
- `#labsGrid`

---

## Run locally (recommended)

### Option A — Python (fastest)
From the repo root:

```bash
python -m http.server 8000
```

Then open:
- `http://localhost:8000/index.html`

### Option B — VS Code Live Server
- Install “Live Server”
- Right click `index.html` → “Open with Live Server”

> Why a server? Some browsers restrict `fetch()` from `file://` pages. Running a local server avoids that.

<br>

## Update content (common edits)

### Add a new Project
Edit: `assets/data/projects.json`

Recommended fields you’ll see:
- `title`
- `blurb`
- `tags` (array)
- `repo` (GitHub link)
- `readme` (optional link)
- `image` (path like `assets/img/weather.png`)

### Add a new Lab
Edit: `assets/data/pyspark_labs.json`

Each lab entry should include:
- `title`
- `level` (ex: Beginner/Intermediate)
- `goal`
- `steps` (array of strings)
- `code` (string) — displayed with syntax highlighting
- `notes` (optional)

### Add a new Training snippet
Edit the appropriate `*_snippets.json` file.

Typical fields:
- `title`
- `note`
- `code`

<br>

## Favicons
Favicons live in `assets/img/`:
- `favicon.svg` (modern)
- `favicon.png` (fallback)
- `favicon.ico` (classic)

Every page includes all three so browser support is consistent.

<br>

## Deploy

### Deploy to GitHub Pages
1. Push to GitHub.
2. In GitHub: **Settings → Pages**
3. Source:
   - Branch: `main`
   - Folder: `/ (root)`
4. Your site will publish at your GitHub Pages URL.

---

### Deploy to Azure (Static Website on Storage — cheapest)
1. Create an Azure Storage Account
2. Enable **Static website**
   - Index document: `index.html`
3. Upload the repo contents to the `$web` container (keep folder structure).
4. Use the Static Website endpoint.
    - Home page: `https://frankrunfola-data-engineering.github.io/de-portfolio-site/index.html`
    - JSON projects: `https://frankrunfola-data-engineering.github.io/de-portfolio-site/assets/data/projects.json`

---

### Deploy to Azure Static Web Apps (also great)
- Create a Static Web App and point it at this repo.
- Since this is plain HTML/CSS/JS, it doesn’t need a build command.

---

## Design rules (so the site stays clean)
- Don’t hardcode project cards in HTML — update JSON.
- Keep shared layout in `layout.js` (don’t copy/paste nav).
- Prefer small, readable snippets over “giant tutorial dumps”.
- Keep the UI consistent (same container width across pages).

---

## Credits / references
- PySpark basics summary content is based on Microsoft Learn Azure Databricks PySpark docs:
  - https://learn.microsoft.com/en-us/azure/databricks/pyspark/
