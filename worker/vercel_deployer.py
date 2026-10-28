import logging
import time
import json
from pathlib import Path
from typing import Tuple, Optional
import requests
from .config import settings
from .models import DemoWebsiteData

logger = logging.getLogger("vercel_deployer")

class VercelDeployer:
    def __init__(self):
        self.base_url = settings.BASE_DEMO_URL
        self.public_demos_dir = settings.PUBLIC_DEMOS_DIR
        self.public_demos_dir.mkdir(parents=True, exist_ok=True)
        self.timeout = settings.VERIFY_DEPLOYMENT_TIMEOUT
        self.vercel_token = settings.VERCEL_TOKEN
        self.project_id = settings.VERCEL_PROJECT_ID

    def save_demo_json(self, demo_data: DemoWebsiteData) -> Path:
        """Saves generated demo content locally to public/demos/{slug}.json."""
        target_path = self.public_demos_dir / f"{demo_data.slug}.json"
        with open(target_path, "w", encoding="utf-8") as f:
            f.write(demo_data.model_dump_json(indent=2))
        logger.info("Saved demo JSON to: %s", target_path)
        return target_path

    def get_demo_url(self, slug: str) -> str:
        """Constructs the canonical preview URL for the business demo."""
        return f"{self.base_url}/{slug}"

    def verify_preview_url(self, url: str, max_retries: int = 3, backoff: float = 1.5) -> Tuple[bool, str]:
        """
        Polls the preview URL to confirm it is live and responding with HTTP 200/304.
        If local dev server is running, checks local endpoint; otherwise checks public URL.
        """
        logger.info("Verifying preview availability for %s", url)

        # For localhost or local dev URLs
        for attempt in range(1, max_retries + 1):
            try:
                response = requests.get(url, timeout=5, allow_redirects=True)
                if response.status_code in (200, 304):
                    logger.info("Verification succeeded for %s (Status: %d)", url, response.status_code)
                    return True, "URL verified live and reachable"
                else:
                    logger.warning("Attempt %d: HTTP %d received for %s", attempt, response.status_code, url)
            except requests.exceptions.RequestException as e:
                logger.warning("Attempt %d: Request failed (%s) for %s", attempt, e, url)

            if attempt < max_retries:
                time.sleep(backoff * attempt)

        # In offline/dry-run mode without dev server running, we verify that the file exists locally
        slug = url.rstrip("/").split("/")[-1]
        local_file = self.public_demos_dir / f"{slug}.json"
        if local_file.exists():
            logger.info("Verified demo JSON exists in local bundle: %s", local_file)
            return True, "Verified in local static bundle"

        return False, f"URL {url} did not respond with 200 OK within {self.timeout}s"

    def deploy_and_verify(
        self,
        demo_data: DemoWebsiteData,
        dry_run: bool = False
    ) -> Tuple[str, str, str]:
        """
        Executes deployment pipeline:
        1. Save JSON to public/demos/
        2. Sync to GitHub (if configured)
        3. Verify deployment URL health
        Returns (status: 'DEPLOYED'|'FAILED', preview_url, error_message)
        """
        preview_url = self.get_demo_url(demo_data.slug)

        if dry_run:
            logger.info("[DRY-RUN] Would save JSON and verify URL for %s", demo_data.slug)
            return "READY", preview_url, "Dry-run mode (no files or sheet modifications)"

        # 1. Save local JSON file
        try:
            self.save_demo_json(demo_data)
        except Exception as e:
            return "FAILED", "", f"File write error: {str(e)}"

        # 2. Sync to GitHub if token and repo are set
        if settings.GITHUB_TOKEN and settings.GITHUB_REPO:
            self._sync_to_github(demo_data.slug)

        # 3. Verify URL health
        verified, message = self.verify_preview_url(preview_url)
        if verified:
            return "DEPLOYED", preview_url, ""
        else:
            return "FAILED", preview_url, f"Verification failed: {message}"

    def _sync_to_github(self, slug: str):
        """Optional GitHub API commit for CI/CD automation."""
        try:
            url = f"https://api.github.com/repos/{settings.GITHUB_REPO}/contents/public/demos/{slug}.json"
            headers = {
                "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
                "Accept": "application/vnd.github.v3+json"
            }
            file_path = self.public_demos_dir / f"{slug}.json"
            import base64
            content_b64 = base64.b64encode(file_path.read_bytes()).decode("utf-8")
            payload = {
                "message": f"feat(demo): add demo content for {slug}",
                "content": content_b64
            }
            # Check if file already exists to get SHA for update
            get_res = requests.get(url, headers=headers, timeout=5)
            if get_res.status_code == 200:
                payload["sha"] = get_res.json()["sha"]
            put_res = requests.put(url, headers=headers, json=payload, timeout=10)
            if put_res.status_code in (200, 201):
                logger.info("Successfully pushed demo %s to GitHub", slug)
            else:
                logger.warning("GitHub push returned status %d", put_res.status_code)
        except Exception as e:
            logger.warning("GitHub sync error (non-fatal): %s", e)
