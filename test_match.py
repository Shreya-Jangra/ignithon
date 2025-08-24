#!/usr/bin/env python3
"""
Test script for the /match endpoint
"""

import requests
import json

def test_match_endpoint():
    """Test the /match endpoint"""
    base_url = "http://localhost:5000"
    
    print("🧪 Testing /match endpoint...")
    print("=" * 50)
    
    try:
        # Test GET request to /match
        response = requests.get(f"{base_url}/match")
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print("\n✅ Success! Response data:")
            print(f"Total Donors: {data.get('total_donors')}")
            print(f"Total NGOs: {data.get('total_ngos')}")
            print(f"Total Food Quantity: {data.get('total_food_quantity')} {data.get('food_units')}")
            
            print("\n📊 Food Type Donations:")
            for food_type, quantity in data.get('donations_by_food_type', {}).items():
                print(f"  {food_type}: {quantity} kg")
            
            print("\n📍 Location Donations:")
            for location, quantity in data.get('donations_by_location', {}).items():
                print(f"  {location}: {quantity} kg")
            
            print("\n🤝 Recent Matches:")
            for match in data.get('recent_matches', []):
                print(f"  {match['donor']} → {match['ngo']}: {match['food']} ({match['quantity']}) - {match['status']}")
                
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure the Flask app is running on http://localhost:5000")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    test_match_endpoint()
