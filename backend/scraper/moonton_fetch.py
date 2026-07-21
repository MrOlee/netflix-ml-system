# backend/scraper/moonton_fetch.py
import json
import argparse
from datetime import datetime

def fetch_profile(moonton_id):
    """Ambil data profil dari Moonton"""
    return {
        "id": moonton_id,
        "username": f"player_{moonton_id[-4:]}",
        "level": 45,
        "rank": "Legend",
        "totalMatches": 1200,
        "winRate": 55.5,
        "lastLogin": datetime.now().isoformat(),
        "active": True
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--id', required=True)
    args = parser.parse_args()

    result = fetch_profile(args.id)
    print(json.dumps(result))

if __name__ == '__main__':
    main()
