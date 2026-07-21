# backend/scraper/ml_scraper.py
import json
import random
import time
import argparse
from datetime import datetime, timedelta

class MLScaper:
    def __init__(self, headless=True):
        self.headless = headless

    def find_abandoned_accounts(self, count=10, min_level=30):
        """Mencari akun ML yang sudah lama tidak digunakan"""
        accounts = []
        
        # Data dummy untuk demonstrasi
        dummy_heroes = [
            {"name": "Gusion", "mastery": random.randint(50, 200), "matches": random.randint(100, 500), "winrate": random.randint(45, 65)},
            {"name": "Lancelot", "mastery": random.randint(40, 180), "matches": random.randint(80, 400), "winrate": random.randint(40, 60)},
            {"name": "Chou", "mastery": random.randint(60, 220), "matches": random.randint(120, 600), "winrate": random.randint(42, 68)},
            {"name": "Kagura", "mastery": random.randint(30, 150), "matches": random.randint(60, 300), "winrate": random.randint(38, 55)},
            {"name": "Harley", "mastery": random.randint(20, 100), "matches": random.randint(40, 200), "winrate": random.randint(35, 50)}
        ]

        ranks = ['Epic', 'Legend', 'Mythic', 'Mythical Glory']
        names = ['Player_', 'Gamer_', 'Pro_', 'Legend_', 'Noob_', 'King_', 'Queen_', 'Destroyer_', 'Shadow_', 'Blade_']
        suffixes = ['X', 'Z', 'YT', 'ID', 'MY', 'SG', 'PH', 'VN', 'TH', 'BR']
        
        for i in range(count):
            level = random.randint(min_level, 60)
            rank = random.choice(ranks) if level > 30 else 'Epic'
            offline_days = random.randint(180, 730)
            
            account = {
                "username": f"{random.choice(names)}{random.randint(100, 9999)}{random.choice(suffixes)}",
                "password": f"ML@{random.randint(1000, 9999)}",
                "moontonId": f"moonton_{random.randint(100000000, 999999999)}",
                "level": level,
                "rank": rank,
                "heroes": random.sample(dummy_heroes, random.randint(3, 5)),
                "totalMatches": random.randint(500, 5000),
                "winRate": random.randint(45, 70),
                "lastLogin": (datetime.now() - timedelta(days=offline_days)).isoformat(),
                "offlineSince": (datetime.now() - timedelta(days=offline_days)).isoformat()
            }
            accounts.append(account)
        
        return accounts

    def verify_moonton_account(self, email, password):
        """Verifikasi akun Moonton"""
        return {"valid": True, "message": "Akun valid (simulasi)"}

    def fetch_moonton_data(self, moonton_id):
        """Ambil data profil dari Moonton"""
        return {"active": True, "lastLogin": datetime.now().isoformat()}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--count', type=int, default=10)
    parser.add_argument('--min-level', type=int, default=30)
    parser.add_argument('--email')
    parser.add_argument('--password')
    parser.add_argument('--id')
    parser.add_argument('--verify', action='store_true')
    parser.add_argument('--fetch', action='store_true')
    args = parser.parse_args()

    scraper = MLScaper(headless=True)

    if args.verify and args.email and args.password:
        result = scraper.verify_moonton_account(args.email, args.password)
        print(json.dumps(result))
    elif args.fetch and args.id:
        result = scraper.fetch_moonton_data(args.id)
        print(json.dumps(result))
    else:
        accounts = scraper.find_abandoned_accounts(args.count, args.min_level)
        print(json.dumps(accounts))

if __name__ == '__main__':
    main()
