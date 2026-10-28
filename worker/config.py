import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env if present
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

class Settings:
    # 1. Google Sheets Configuration
    GOOGLE_CREDENTIALS_PATH: str = os.getenv("GOOGLE_CREDENTIALS_PATH", "credentials.json")
    GOOGLE_SHEET_NAME: str = os.getenv("GOOGLE_SHEET_NAME", "sneha real estate agent")
    GOOGLE_WORKSHEET_NAME: str = os.getenv("GOOGLE_WORKSHEET_NAME", "Sheet1")

    # Column index mappings (1-based index)
    # A: google map link (1)
    # B: works / business name (2)
    # C: company name / category (3)
    # D: address (4)
    # E: mobile Number (5)
    # F: website (6)
    # G-K: preserved (7-11)
    # L: demo_slug (12)
    # M: demo_status (13)
    # N: demo_url (14)
    # O: demo_generated_at (15)
    # P: outreach_approved (16)
    # Q: error_message (17)
    COL_MAP_LINK: int = int(os.getenv("COL_MAP_LINK", "1"))
    COL_WORKS: int = int(os.getenv("COL_WORKS", "2"))
    COL_COMPANY_NAME: int = int(os.getenv("COL_COMPANY_NAME", "3"))
    COL_ADDRESS: int = int(os.getenv("COL_ADDRESS", "4"))
    COL_MOBILE: int = int(os.getenv("COL_MOBILE", "5"))
    COL_WEBSITE: int = int(os.getenv("COL_WEBSITE", "6"))
    COL_EXISTING_STATUS: int = int(os.getenv("COL_EXISTING_STATUS", "8"))
    
    COL_DEMO_SLUG: int = int(os.getenv("COL_DEMO_SLUG", "12"))
    COL_DEMO_STATUS: int = int(os.getenv("COL_DEMO_STATUS", "13"))
    COL_DEMO_URL: int = int(os.getenv("COL_DEMO_URL", "14"))
    COL_DEMO_GENERATED_AT: int = int(os.getenv("COL_DEMO_GENERATED_AT", "15"))
    COL_OUTREACH_APPROVED: int = int(os.getenv("COL_OUTREACH_APPROVED", "16"))
    COL_ERROR_MESSAGE: int = int(os.getenv("COL_ERROR_MESSAGE", "17"))

    # 2. AI Engine
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # 3. Base Deployment URL
    BASE_DEMO_URL: str = os.getenv("BASE_DEMO_URL", "https://shamshadcodesproject.vercel.app").rstrip("/")

    # 4. GitHub & Vercel
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN", "")
    GITHUB_REPO: str = os.getenv("GITHUB_REPO", "")
    VERCEL_TOKEN: str = os.getenv("VERCEL_TOKEN", "")
    VERCEL_PROJECT_ID: str = os.getenv("VERCEL_PROJECT_ID", "")
    VERCEL_TEAM_ID: str = os.getenv("VERCEL_TEAM_ID", "")

    # 5. Security & Admin
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "shamshad_secure_admin_2026")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super_secret_jwt_key_at_least_32_chars_long")

    # 6. Operational Guardrails
    BATCH_SIZE_LIMIT: int = int(os.getenv("BATCH_SIZE_LIMIT", "5"))
    DRY_RUN: bool = os.getenv("DRY_RUN", "false").lower() in ("true", "1", "yes")
    VERIFY_DEPLOYMENT_TIMEOUT: int = int(os.getenv("VERIFY_DEPLOYMENT_TIMEOUT", "15"))

    # File paths
    PUBLIC_DEMOS_DIR: Path = BASE_DIR / "public" / "demos"

settings = Settings()
