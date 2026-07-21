# backend/scraper/moonton_verify.py
import json
import argparse
import sys

def verify_moonton(email, password):
    """Fungsi verifikasi akun Moonton"""
    # Simulasi verifikasi
    return {
        "valid": True,
        "email": email,
        "message": "Verifikasi berhasil",
        "user_id": "moonton_" + email.split('@')[0]
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--email', required=True)
    parser.add_argument('--password', required=True)
    args = parser.parse_args()

    result = verify_moonton(args.email, args.password)
    print(json.dumps(result))

if __name__ == '__main__':
    main()
