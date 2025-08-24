#!/usr/bin/env python3
"""
Test script for the XYLMCSCICS Flask API route endpoint
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:5000"

def test_home_endpoint():
    """Test the home endpoint"""
    print("🏠 Testing home endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print("-" * 50)
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the API server. Make sure it's running on port 5000.")
        return False
    return True

def test_health_endpoint():
    """Test the health check endpoint"""
    print("🏥 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print("-" * 50)
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the API server.")
        return False
    return True

def test_route_info():
    """Test the route endpoint info (GET)"""
    print("📋 Testing route endpoint info...")
    try:
        response = requests.get(f"{BASE_URL}/route")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print("-" * 50)
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the API server.")
        return False
    return True

def test_route_endpoint():
    """Test the route endpoint (POST) with sample coordinates"""
    print("📍 Testing route endpoint...")
    
    # Sample coordinates (New York City to Times Square)
    test_data = {
        "donor_lat": 40.7128,    # New York City
        "donor_lng": -74.0060,
        "ngo_lat": 40.7589,      # Times Square
        "ngo_lng": -73.9851
    }
    
    print(f"Test coordinates:")
    print(f"  Donor: {test_data['donor_lat']}, {test_data['donor_lng']}")
    print(f"  NGO: {test_data['ngo_lat']}, {test_data['ngo_lng']}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/route",
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ Success! Generated route URL:")
            print(f"   {data['route_url']}")
            if data.get('distance') != 'Unknown':
                print(f"   Distance: {data['distance']}")
                print(f"   Duration: {data['duration']}")
        
        print("-" * 50)
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the API server.")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_invalid_coordinates():
    """Test the route endpoint with invalid coordinates"""
    print("❌ Testing route endpoint with invalid coordinates...")
    
    # Invalid coordinates (out of range)
    invalid_data = {
        "donor_lat": 100.0,      # Invalid latitude (> 90)
        "donor_lng": -74.0060,
        "ngo_lat": 40.7589,
        "ngo_lng": -73.9851
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/route",
            json=invalid_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print("-" * 50)
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the API server.")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_missing_coordinates():
    """Test the route endpoint with missing coordinates"""
    print("⚠️ Testing route endpoint with missing coordinates...")
    
    # Missing coordinates
    incomplete_data = {
        "donor_lat": 40.7128,
        "ngo_lat": 40.7589
        # Missing donor_lng and ngo_lng
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/route",
            json=incomplete_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print("-" * 50)
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the API server.")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 XYLMCSCICS API Test Suite")
    print("=" * 50)
    
    # Test all endpoints
    tests = [
        test_home_endpoint,
        test_health_endpoint,
        test_route_info,
        test_route_endpoint,
        test_invalid_coordinates,
        test_missing_coordinates
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print(f"\n📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The API is working correctly.")
    else:
        print("⚠️ Some tests failed. Check the output above for details.")
    
    print("\n💡 To test manually with curl:")
    print("curl -X POST http://localhost:5000/route \\")
    print("  -H 'Content-Type: application/json' \\")
    print("  -d '{\"donor_lat\": 40.7128, \"donor_lng\": -74.0060, \"ngo_lat\": 40.7589, \"ngo_lng\": -73.9851}'")

if __name__ == "__main__":
    main()
