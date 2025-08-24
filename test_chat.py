#!/usr/bin/env python3
"""
Test script for the XYLMCSCICS Flask API chat endpoint
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_chat():
    print("Testing chat endpoint...")
    
    message = "I have 20 rotis in Delhi expiring in 4 hours"
    
    try:
        response = requests.post(
            f"{BASE_URL}/chat",
            json={"message": message},
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_chat()
