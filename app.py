from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import json
import openai
import json
import openai

# Load environment variables
load_dotenv()

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/')
def home():
    return jsonify({
        "message": "XYLMCSCICS Food Donation Platform API",
        "endpoints": {
            "route": "/route - Get Google Maps directions between donor and NGO",
            "chat": "/chat - Process food donation messages with AI",
            "health": "/health - API health check"
        }
    })

@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "XYLMCSCICS API",
        "version": "1.0.0"
    })

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    """
    Process user messages about food donations using OpenAI API
    
    Expected JSON payload:
    {
        "message": "I have 20 rotis in Delhi expiring in 4 hours"
    }
    
    Returns:
    {
        "food": "rotis",
        "quantity": "20",
        "expiry": "4 hours",
        "location": "Delhi",
        "status": "success"
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "No JSON data provided",
                "status": "error"
            }), 400
        
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({
                "error": "Missing 'message' field",
                "status": "error"
            }), 400
        
        # Check if OpenAI API key is configured
        if not openai.api_key:
            return jsonify({
                "error": "OpenAI API key not configured",
                "status": "error"
            }), 500
        
        # Create system prompt to force JSON output
        system_prompt = """You are a food donation assistant. Extract food donation information from user messages and return ONLY a valid JSON object with these exact fields:
{
    "food": "food item name",
    "quantity": "amount/quantity",
    "expiry": "expiry time",
    "location": "city/location"
}

Rules:
- Return ONLY the JSON object, no other text
- Ensure the JSON is valid and parseable
- Extract the most relevant information from the message
- If a field is not mentioned, use "unknown" as the value
- Keep responses concise and accurate

Example input: "I have 20 rotis in Delhi expiring in 4 hours"
Example output: {"food": "rotis", "quantity": "20", "expiry": "4 hours", "location": "Delhi"}"""

        try:
            # Call OpenAI API
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=150,
                temperature=0.1  # Low temperature for consistent JSON output
            )
            
            # Extract the response content
            ai_response = response.choices[0].message.content.strip()
            
            # Try to parse the JSON response
            try:
                parsed_data = json.loads(ai_response)
                
                # Validate required fields
                required_fields = ["food", "quantity", "expiry", "location"]
                for field in required_fields:
                    if field not in parsed_data:
                        parsed_data[field] = "unknown"
                
                # Add status and original message
                result = {
                    "food": parsed_data.get("food", "unknown"),
                    "quantity": parsed_data.get("quantity", "unknown"),
                    "expiry": parsed_data.get("expiry", "unknown"),
                    "location": parsed_data.get("location", "unknown"),
                    "status": "success",
                    "original_message": user_message
                }
                
                return jsonify(result)
                
            except json.JSONDecodeError as e:
                # If JSON parsing fails, try to extract information manually
                print(f"JSON parsing failed: {e}")
                print(f"AI response: {ai_response}")
                
                # Fallback: return a basic structure
                return jsonify({
                    "food": "unknown",
                    "quantity": "unknown",
                    "expiry": "unknown",
                    "location": "unknown",
                    "status": "partial_success",
                    "original_message": user_message,
                    "ai_response": ai_response,
                    "note": "JSON parsing failed, using fallback"
                })
                
        except Exception as openai_error:
            print(f"OpenAI API error: {openai_error}")
            return jsonify({
                "error": f"OpenAI API error: {str(openai_error)}",
                "status": "error"
            }), 500
        
    except Exception as e:
        return jsonify({
            "error": f"An error occurred: {str(e)}",
            "status": "error"
        }), 500

@app.route('/chat', methods=['GET'])
def chat_info():
    """GET endpoint to show chat endpoint information"""
    return jsonify({
        "endpoint": "/chat",
        "method": "POST",
        "description": "Process food donation messages using AI to extract structured information",
        "required_fields": {
            "message": "User message about food donation (string)"
        },
        "example_request": {
            "message": "I have 20 rotis in Delhi expiring in 4 hours"
        },
        "example_response": {
            "food": "rotis",
            "quantity": "20",
            "expiry": "4 hours",
            "location": "Delhi",
            "status": "success",
            "original_message": "I have 20 rotis in Delhi expiring in 4 hours"
        },
        "ai_model": "GPT-3.5 Turbo",
        "note": "Requires OPENAI_API_KEY environment variable"
    })

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    """
    Process user messages about food donations using OpenAI API
    
    Expected JSON payload:
    {
        "message": "I have 20 rotis in Delhi expiring in 4 hours"
    }
    
    Returns:
    {
        "food": "rotis",
        "quantity": "20",
        "expiry": "4 hours",
        "location": "Delhi",
        "status": "success"
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "No JSON data provided",
                "status": "error"
            }), 400
        
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({
                "error": "Missing 'message' field",
                "status": "error"
            }), 400
        
        # Check if OpenAI API key is configured
        if not openai.api_key:
            return jsonify({
                "error": "OpenAI API key not configured",
                "status": "error"
            }), 500
        
        # Create system prompt to force JSON output
        system_prompt = """You are a food donation assistant. Extract food donation information from user messages and return ONLY a valid JSON object with these exact fields:
{
    "food": "food item name",
    "quantity": "amount/quantity",
    "expiry": "expiry time",
    "location": "city/location"
}

Rules:
- Return ONLY the JSON object, no other text
- Ensure the JSON is valid and parseable
- Extract the most relevant information from the message
- If a field is not mentioned, use "unknown" as the value
- Keep responses concise and accurate

Example input: "I have 20 rotis in Delhi expiring in 4 hours"
Example output: {"food": "rotis", "quantity": "20", "expiry": "4 hours", "location": "Delhi"}"""

        try:
            # Call OpenAI API
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=150,
                temperature=0.1  # Low temperature for consistent JSON output
            )
            
            # Extract the response content
            ai_response = response.choices[0].message.content.strip()
            
            # Try to parse the JSON response
            try:
                parsed_data = json.loads(ai_response)
                
                # Validate required fields
                required_fields = ["food", "quantity", "expiry", "location"]
                for field in required_fields:
                    if field not in parsed_data:
                        parsed_data[field] = "unknown"
                
                # Add status and original message
                result = {
                    "food": parsed_data.get("food", "unknown"),
                    "quantity": parsed_data.get("quantity", "unknown"),
                    "expiry": parsed_data.get("expiry", "unknown"),
                    "location": parsed_data.get("location", "unknown"),
                    "status": "success",
                    "original_message": user_message
                }
                
                return jsonify(result)
                
            except json.JSONDecodeError as e:
                # If JSON parsing fails, try to extract information manually
                print(f"JSON parsing failed: {e}")
                print(f"AI response: {ai_response}")
                
                # Fallback: return a basic structure
                return jsonify({
                    "food": "unknown",
                    "quantity": "unknown",
                    "expiry": "unknown",
                    "location": "unknown",
                    "status": "partial_success",
                    "original_message": user_message,
                    "ai_response": ai_response,
                    "note": "JSON parsing failed, using fallback"
                })
                
        except Exception as openai_error:
            print(f"OpenAI API error: {openai_error}")
            return jsonify({
                "error": f"OpenAI API error: {str(openai_error)}",
                "status": "error"
            }), 500
        
    except Exception as e:
        return jsonify({
            "error": f"An error occurred: {str(e)}",
            "status": "error"
        }), 500

@app.route('/route', methods=['POST'])
def get_route():
    """
    Generate Google Maps directions link between donor and NGO coordinates
    
    Expected JSON payload:
    {
        "donor_lat": float,
        "donor_lng": float,
        "ngo_lat": float,
        "ngo_lng": float
    }
    
    Returns:
    {
        "route_url": "https://www.google.com/maps/dir/lat1,lng1/lat2,lng2",
        "distance": "5.2 km",
        "duration": "15 mins",
        "status": "success"
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                "error": "No JSON data provided",
                "status": "error"
            }), 400
        
        # Extract coordinates
        donor_lat = data.get('donor_lat')
        donor_lng = data.get('donor_lng')
        ngo_lat = data.get('ngo_lat')
        ngo_lng = data.get('ngo_lng')
        
        # Validate coordinates
        if not all([donor_lat, donor_lng, ngo_lat, ngo_lng]):
            return jsonify({
                "error": "Missing coordinates. Required: donor_lat, donor_lng, ngo_lat, ngo_lng",
                "status": "error"
            }), 400
        
        # Validate coordinate ranges
        if not (-90 <= donor_lat <= 90) or not (-180 <= donor_lng <= 180):
            return jsonify({
                "error": "Invalid donor coordinates. Latitude must be between -90 and 90, longitude between -180 and 180",
                "status": "error"
            }), 400
            
        if not (-90 <= ngo_lat <= 90) or not (-180 <= ngo_lng <= 180):
            return jsonify({
                "error": "Invalid NGO coordinates. Latitude must be between -90 and 90, longitude between -180 and 180",
                "status": "error"
            }), 400
        
        # Generate Google Maps directions URL
        route_url = f"https://www.google.com/maps/dir/{donor_lat},{donor_lng}/{ngo_lat},{ngo_lng}"
        
        # Optional: Get distance and duration using Google Maps Distance Matrix API
        distance_info = get_distance_info(donor_lat, donor_lng, ngo_lat, ngo_lng)
        
        return jsonify({
            "route_url": route_url,
            "distance": distance_info.get("distance", "Unknown"),
            "duration": distance_info.get("duration", "Unknown"),
            "status": "success",
            "coordinates": {
                "donor": {"lat": donor_lat, "lng": donor_lng},
                "ngo": {"lat": ngo_lat, "lng": ngo_lng}
            }
        })
        
    except Exception as e:
        return jsonify({
            "error": f"An error occurred: {str(e)}",
            "status": "error"
        }), 500

def get_distance_info(origin_lat, origin_lng, dest_lat, dest_lng):
    """
    Get distance and duration information using Google Maps Distance Matrix API
    Note: Requires Google Maps API key
    """
    api_key = os.getenv('GOOGLE_MAPS_API_KEY')
    
    if not api_key:
        return {"distance": "Unknown", "duration": "Unknown"}
    
    try:
        url = "https://maps.googleapis.com/maps/api/distancematrix/json"
        params = {
            'origins': f"{origin_lat},{origin_lng}",
            'destinations': f"{dest_lat},{dest_lng}",
            'key': api_key,
            'units': 'metric'
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if data['status'] == 'OK' and data['rows'][0]['elements'][0]['status'] == 'OK':
            element = data['rows'][0]['elements'][0]
            distance = element['distance']['text']
            duration = element['duration']['text']
            return {"distance": distance, "duration": duration}
        else:
            return {"distance": "Unknown", "duration": "Unknown"}
            
    except Exception as e:
        print(f"Error getting distance info: {e}")
        return {"distance": "Unknown", "duration": "Unknown"}

@app.route('/route', methods=['GET'])
def route_info():
    """GET endpoint to show route endpoint information"""
    return jsonify({
        "endpoint": "/route",
        "method": "POST",
        "description": "Generate Google Maps directions between donor and NGO coordinates",
        "required_fields": {
            "donor_lat": "Donor latitude (float, -90 to 90)",
            "donor_lng": "Donor longitude (float, -180 to 180)",
            "ngo_lat": "NGO latitude (float, -90 to 90)",
            "ngo_lng": "NGO longitude (float, -180 to 180)"
        },
        "example_request": {
            "donor_lat": 40.7128,
            "donor_lng": -74.0060,
            "ngo_lat": 40.7589,
            "ngo_lng": -73.9851
        },
        "example_response": {
            "route_url": "https://www.google.com/maps/dir/40.7128,-74.0060/40.7589,-73.9851",
            "distance": "5.2 km",
            "duration": "15 mins",
            "status": "success"
        }
    })

if __name__ == '__main__':
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5000))
    
    print(f"🚀 Starting XYLMCSCICS API server on port {port}")
    print(f"📍 Route endpoint: http://localhost:{port}/route")
    print(f"💬 Chat endpoint: http://localhost:{port}/chat")
    print(f"🏥 Health check: http://localhost:{port}/health")
    
    # Check if OpenAI API key is configured
    if not os.getenv('OPENAI_API_KEY'):
        print("⚠️  Warning: OPENAI_API_KEY not configured. Chat endpoint will not work.")
    else:
        print("✅ OpenAI API key configured. Chat endpoint is ready.")
    
    app.run(host='0.0.0.0', port=port, debug=True)
