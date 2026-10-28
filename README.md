# ShamshadCodes Website Factory

**Automated Google Sheets Lead-to-Demo Engine for Commercial Outreach**  
*Built for ShamshadCodes by Senior Full-Stack Engineering*

---

## 1. System Overview

**ShamshadCodes Website Factory** is an end-to-end automated platform that:
1. Ingests business leads directly from your existing Google Sheet (`sneha real estate agent`).
2. Strictly preserves your spreadsheet columns A–K without overwriting existing data.
3. Classifies businesses into tailored industry templates (Real Estate, Interior Design, Hotel/Hospitality, Education, and Professional Services).
4. Identifies whether a business needs a **New Website** (no active web presence) or a **Redesign Pitch** (existing outdated website).
5. Generates high-converting, accurate website copy with structured JSON outputs and strict anti-hallucination guardrails (no fake claims, no invented reviews).
6. Hosts hundreds of personalized demos under **one single Vercel deployment** (`demo.shamshadcodes.com/:slug`).
7. Writes generated demo metadata (unique slug, deployment status, preview URL, timestamp, outreach approval) back to columns L–Q in your Google Sheet.
8. Provides a password-protected **Admin Dashboard** (`/dashboard`) for operational control, dry-runs, and outreach verification.

---

## 2. Folder Structure

```
ShamshadCodes Website Factory/
├── .env.example              # Environment variables template
├── .gitignore                # Comprehensive secret and dependency exclusion
├── package.json              # Frontend dependencies (React, Vite, Tailwind CSS)
├── requirements.txt          # Python worker dependencies (gspread, FastAPI, etc.)
├── run_tests.py              # Zero-dependency automated test suite
├── vercel.json               # Vercel SPA rewrite & CDN caching config
├── vite.config.ts            # Vite build and proxy configuration
├── tsconfig.json             # TypeScript compiler settings
├── tailwind.config.js        # Custom styling and palette tokens
├── public/
│   └── demos/                # Generated business JSON demo store
│       ├── prinal-real-estate-property.json
│       ├── prinal-real-estate-property-2.json
│       └── pranay-prabhu-real-estate.json
├── src/
│   ├── types/
│   │   └── demo.ts           # TypeScript interfaces and lead schemas
│   ├── templates/            # Specialized industry templates
│   │   ├── RealEstateTemplate.tsx
│   │   ├── InteriorDesignTemplate.tsx
│   │   ├── HotelTemplate.tsx
│   │   ├── EducationTemplate.tsx
│   │   └── ProfessionalTemplate.tsx
│   ├── components/
│   │   ├── ConceptBanner.tsx      # Unapproved concept disclaimer top bar
│   │   ├── ContactBar.tsx         # Mobile-first sticky Call & WhatsApp bar
│   │   ├── LeadInquiryModal.tsx   # Direct customer consultation modal
│   │   └── ProtectedRoute.tsx     # Route authentication guard
│   ├── pages/
│   │   ├── DemoViewer.tsx         # Dynamic multi-tenant demo renderer (/:slug)
│   │   ├── Dashboard.tsx          # Authenticated operations dashboard
│   │   └── Login.tsx              # Admin authentication screen
│   ├── data/
│   │   └── sample-demos.ts        # Instant fallback demo data
│   ├── App.tsx                    # React router setup
│   ├── main.tsx                   # App bootstrap
│   └── index.css                  # Tailwind styles
├── worker/
│   ├── __init__.py
│   ├── config.py             # Environment configurations
│   ├── models.py             # Pydantic schemas and lead row models
│   ├── slug_service.py       # Kebab-case URL slug generator & deduplicator
│   ├── sheets_service.py     # Google Sheets reader & atomic L-Q writer
│   ├── ai_generator.py       # AI copy engine (Gemini & deterministic engine)
│   ├── vercel_deployer.py    # Vercel & GitHub sync and URL health verifier
│   ├── pipeline.py           # End-to-end batch processing pipeline
│   ├── api.py                # FastAPI server powering the dashboard
│   └── cli.py                # Command-line batch runner
└── tests/
    ├── test_slug.py          # Slug sanitization & deduplication tests
    ├── test_validation.py    # Data & phone validation tests
    ├── test_ai_generator.py  # Category classification & prompt tests
    └── test_pipeline.py      # Dry-run and error resilience tests
```

---

## 3. Google Sheets Configuration & Layout

### Strict Column Preservation Rules

The system interacts with your spreadsheet (`sneha real estate agent`) while respecting existing lead data:

| Column | Header | Meaning & Rule |
| :---: | :--- | :--- |
| **A** | `google map link` | **Preserved**. Extracted for location buttons and distance advisory. |
| **B** | `works` | **Preserved**. Primary business title used for branding and slug creation. |
| **C** | `company name` | **Preserved**. Category used for template classification. |
| **D** | `address` | **Preserved**. Local address rendered on previews. |
| **E** | `mobile Number` | **Preserved**. Sanitized for display, `tel:` links, and WhatsApp triggers. |
| **F** | `website` | **Preserved**. Evaluated to classify lead as **New Website** vs **Redesign**. |
| **G** | `R8c4Qb` | **Preserved & Untouched**. Internal dropdown / Google Maps artifact. |
| **H** | *(status)* | **Preserved**. Lead status (e.g. `Message Sent`). |
| **I** | `last contact` | **Preserved & Untouched**. |
| **J** | `next followup` | **Preserved & Untouched**. |
| **K** | `contact numbar` | **Preserved & Untouched**. |

### Generated Metadata Starting at Column L

| Column | Header | System Behavior |
| :---: | :--- | :--- |
| **L** | `demo_slug` | Clean kebab-cased slug (e.g., `prinal-real-estate-property`). |
| **M** | `demo_status` | Automation trigger & state: `READY` &rarr; `GENERATING` &rarr; `DEPLOYED` / `FAILED`. |
| **N** | `demo_url` | Live preview URL (`https://demo.shamshadcodes.com/prinal-real-estate-property`). |
| **O** | `demo_generated_at` | Timestamp of successful generation (`YYYY-MM-DD HH:MM:SS`). |
| **P** | `outreach_approved` | `PENDING` / `APPROVED`. Toggled in dashboard before messaging prospects. |
| **Q** | `error_message` | Detailed diagnostic message if validation or generation fails. |

---

## 4. Setup Instructions

### 4.1 Google Cloud & Sheets Setup
1. **Service Account**:
   Ensure `credentials.json` is located in the root directory.
   *(The service account `whatsapp-bot@whatsappautomation-499707.iam.gserviceaccount.com` is already configured).*
2. **Spreadsheet Access**:
   Share the Google Sheet (`sneha real estate agent`) with the service account email as **Editor**.
3. **Verify Connection**:
   ```bash
   python -c "from worker.sheets_service import GoogleSheetsService; gs = GoogleSheetsService(); print('Connected:', gs.sheet_name)"
   ```

### 4.2 Environment Configuration
Copy `.env.example` to `.env` and adjust your preferences:
```bash
cp .env.example .env
```
Key variables:
- `GOOGLE_CREDENTIALS_PATH=credentials.json`
- `GOOGLE_SHEET_NAME=sneha real estate agent`
- `AI_PROVIDER=gemini` (or leave empty to use deterministic generator)
- `GEMINI_API_KEY=your_key_here`
- `BASE_DEMO_URL=http://localhost:5173` (or `https://demo.shamshadcodes.com`)
- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD=shamshad_secure_admin_2026`

### 4.3 Local Development

**1. Install Dependencies:**
```bash
# Frontend
npm install

# Backend (Python 3.10+)
pip install -r requirements.txt
```

**2. Start the Frontend Dev Server:**
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

**3. Start the FastAPI Operations Backend (Optional for live Dashboard):**
```bash
uvicorn worker.api:app --reload --port 8000
```

---

## 5. Automation Worker Execution

### Dry-Run Mode
Test slug creation, AI copy generation, and data validation without writing to Google Sheets:
```bash
python -m worker.cli --dry-run --limit 3
```

### Live Generation Run
Processes rows marked `READY` in column M (up to 5 leads per batch):
```bash
python -m worker.cli --limit 5
```

---

## 6. Hosting Architecture on Vercel

To host thousands of demos without deploying a separate project for each lead:

1. **Push Repository to GitHub**:
   ```bash
   git remote add origin https://github.com/your-username/shamshadcodes-website-factory.git
   git push -u origin master
   ```
2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com) &rarr; **Add New Project**.
   - Select your repository.
   - Framework Preset: **Vite**.
   - Output Directory: `dist`.
   - Click **Deploy**.
3. **Wildcard / Subpath Routing**:
   The included `vercel.json` ensures that any URL path (`/:slug`) routes dynamically to `index.html`.
   The React router reads the slug from the URL and fetches the corresponding demo data seamlessly.

---

## 7. Content Store Trade-Off Analysis

| Feature | Git-Committed JSON (Implemented) | External Database (Postgres/Supabase) |
| :--- | :--- | :--- |
| **Cost** | \$0 (Free on Vercel & GitHub) | \$15–\$25/month for managed DB |
| **Maintenance** | Zero migrations, 100% version-controlled | Requires connection pooling, schema migrations |
| **Speed** | Instant CDN edge caching via Vercel | 50–200ms DB query latency |
| **Redeployment Needs** | Batch commits sync with git; local previews render instantly | Live database reads without git commits |
| **Recommendation** | **Best for MVP and scaling up to 1,000 demos** | Recommended if clients need self-service CMS editing |

---

## 8. Security & Ethical Guardrails

- **Zero Arbitrary Code Execution**: AI output is strictly parsed as JSON and typed with Pydantic. It is rendered through pure React JSX bindings (no `dangerouslySetInnerHTML`).
- **No Committed Secrets**: Service accounts and `.env` are strictly protected in `.gitignore`.
- **Anti-Hallucination Policy**:
  - The AI prompt and deterministic generator strictly forbid creating fake customer reviews, fictitious star ratings, fabricated awards, or speculative pricing.
- **Mandatory Disclaimer Banner**:
  - Every demo displays an unmissable top bar:
    > *"ShamshadCodes Concept Preview — Unofficial demonstration created for [Business Name]. Not affiliated with or endorsed by [Business Name]."*
- **Human Review Before Outreach**:
  - Column P (`outreach_approved`) requires manual approval in the dashboard before sending pitch messages to business owners.

---

## 9. Running Costs Estimation

| Service | Free Tier / Cost | Estimated Monthly Cost |
| :--- | :--- | :--- |
| **Vercel Hosting** | Hobby Tier: 100 GB bandwidth, unlimited domains | **\$0.00** |
| **Google Sheets API** | Free: 300 requests/minute | **\$0.00** |
| **Gemini 1.5 Flash API** | Free tier: 15 RPM / paid: \$0.075 per 1M tokens | **\$0.00 – \$0.50** (for 500 leads) |
| **GitHub** | Free public or private repositories | **\$0.00** |
| **Total Estimated Operating Cost** | &mdash; | **\$0.00 / month** |

---

## 10. Troubleshooting Guide

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `gspread.exceptions.SpreadsheetNotFound` | Sheet name does not match or service account has no access | Verify sheet is named `sneha real estate agent` and shared with `whatsapp-bot@whatsappautomation-499707.iam.gserviceaccount.com` as Editor. |
| `No leads currently marked 'READY' in column M` | All rows have empty or non-READY values in Column M | Open the sheet and type `READY` in column M for the rows you wish to process. |
| `Demo Not Found` on preview URL | The slug does not exist in `public/demos/` | Run the worker or verify the slug in column L matches the URL. |
| `Failed to resolve 'oauth2.googleapis.com'` | Command run in sandboxed terminal without network | Run Python commands with network access enabled. |

---

## 11. Running Automated Tests

Run the full automated test suite anytime:
```bash
python run_tests.py
```
Expected output:
```
Ran 8 tests in 0.012s
OK
```
