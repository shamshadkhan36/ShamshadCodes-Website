import argparse
import sys
from .pipeline import DemoPipeline
from .config import settings

def main():
    parser = argparse.ArgumentParser(
        description="ShamshadCodes Website Factory Automation CLI"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Run without modifying Google Sheets or deploying files"
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=5,
        help="Maximum leads to process in this run (max 5)"
    )

    args = parser.parse_args()

    print("==================================================")
    print(" ShamshadCodes Website Factory - CLI Runner")
    print(f" Sheet: {settings.GOOGLE_SHEET_NAME}")
    print(f" Dry Run: {args.dry_run}")
    print(f" Limit: {min(args.limit, settings.BATCH_SIZE_LIMIT)}")
    print("==================================================")

    pipeline = DemoPipeline()
    result = pipeline.run_batch(limit=args.limit, dry_run=args.dry_run)

    print("\nBatch Execution Complete:")
    print(f" - Processed: {result.processedCount}")
    print(f" - Deployed:  {result.deployedCount}")
    print(f" - Failed:    {result.failedCount}")
    print("\nDetails:")
    for d in result.details:
        print(f"  • {d}")

    sys.exit(0 if result.success else 1)

if __name__ == "__main__":
    main()
