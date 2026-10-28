import re
import unicodedata
from typing import Set, Optional
from pathlib import Path
from .config import settings

def clean_business_name_for_slug(name: str) -> str:
    """
    Extract a concise, clean base string from a business name.
    E.g. "Prinal Real Estate Property, Farm House Plot, 1 Acre Plot, Industrial Plot, Sea Beach Plot, Umbergaon Gujrat Property"
    -> "prinal-real-estate-property"
    """
    if not name:
        return "business-demo"

    # If business name has commas or long descriptors, take the primary title
    parts = re.split(r'[,|/•-]', name)
    primary = parts[0].strip() if parts else name.strip()

    # Normalize unicode
    normalized = unicodedata.normalize('NFKD', primary).encode('ascii', 'ignore').decode('ascii')
    
    # Remove unwanted punctuation
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', normalized).lower()
    slug = re.sub(r'[\s_-]+', '-', slug).strip('-')

    # Truncate to reasonable length (e.g. 45 chars)
    slug = slug[:45].rstrip('-')
    
    return slug or "business-demo"

def generate_unique_slug(
    business_name: str,
    existing_slugs: Optional[Set[str]] = None,
    demos_dir: Optional[Path] = None
) -> str:
    """
    Generates a unique kebab-case slug and ensures it does not collide with:
    1. existing_slugs from the Google Sheet
    2. files already existing in the demos_dir
    """
    if existing_slugs is None:
        existing_slugs = set()

    if demos_dir is None:
        demos_dir = settings.PUBLIC_DEMOS_DIR

    base_slug = clean_business_name_for_slug(business_name)
    candidate = base_slug
    counter = 2

    # Check collision against existing set and filesystem
    while True:
        file_exists = False
        if demos_dir.exists():
            file_exists = (demos_dir / f"{candidate}.json").exists()

        if candidate not in existing_slugs and not file_exists:
            return candidate

        candidate = f"{base_slug}-{counter}"
        counter += 1
