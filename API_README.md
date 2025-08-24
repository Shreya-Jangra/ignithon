# XYLMCSCICS Flask API

A Flask-based API for the XYLMCSCICS Food Donation Platform with AI-powered message processing and route generation.

## 🚀 Features

- **Route Generation**: Generate Google Maps directions between donor and NGO coordinates
- **AI Chat Processing**: Process natural language food donation messages using OpenAI GPT-3.5
- **Health Monitoring**: API health check endpoint
- **CORS Support**: Cross-origin resource sharing enabled

## 📁 Endpoints

### 1. Home (`/`)
- **Method**: GET
- **Description**: API information and available endpoints
- **Response**: List of all available endpoints

### 2. Health Check (`/health`)
- **Method**: GET
- **Description**: API health status
- **Response**: Service status and version information

### 3. Chat (`/chat`)
- **Method**: POST
- **Description**: Process food donation messages using AI
- **Input**: JSON with `message` field
- **Output**: Structured JSON with food, quantity, expiry, and location

#### Example Request:
```json
{
    "message": "I have 20 rotis in Delhi expiring in 4 hours"
}
```

#### Example Response:
```json
{
    "food": "rotis",
    "quantity": "20",
    "expiry": "4 hours",
    "location": "Delhi",
    "status": "success",
    "original_message": "I have 20 rotis in Delhi expiring in 4 hours"
}
```

### 4. Route (`/route`)
- **Method**: POST
- **Description**: Generate Google Maps directions between coordinates
- **Input**: JSON with donor and NGO coordinates
- **Output**: Google Maps URL and distance information

## 🛠️ Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Variables
Create a `.env` file with:
```env
# Required for chat endpoint
OPENAI_API_KEY=your_openai_api_key_here

# Optional for route endpoint distance/duration
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Flask configuration
FLASK_ENV=development
PORT=5000
```

### 3. Run the API
```bash
python app.py
```

The API will start on `http://localhost:5000`

## 🧪 Testing

### Test the Chat Endpoint
```bash
python test_chat.py
```

### Test with curl
```bash
# Test chat endpoint
curl -X POST http://localhost:5000/chat \
  -H 'Content-Type: application/json' \
  -d '{"message": "I have 20 rotis in Delhi expiring in 4 hours"}'

# Test route endpoint
curl -X POST http://localhost:5000/route \
  -H 'Content-Type: application/json' \
  -d '{"donor_lat": 40.7128, "donor_lng": -74.0060, "ngo_lat": 40.7589, "ngo_lng": -73.9851}'
```

## 🔑 API Keys

### OpenAI API Key
- Required for the `/chat` endpoint
- Get from: https://platform.openai.com/api-keys
- Used for processing natural language messages

### Google Maps API Key (Optional)
- Used for distance and duration calculations in `/route` endpoint
- Get from: https://developers.google.com/maps/documentation/distance-matrix/get-api-key

## 📊 Response Format

All endpoints return JSON responses with:
- `status`: "success", "error", or "partial_success"
- Error responses include `error` field with description
- Success responses include relevant data fields

## 🚨 Error Handling

- **400 Bad Request**: Invalid input data
- **500 Internal Server Error**: Server-side errors
- **JSON Validation**: Ensures proper request format
- **Coordinate Validation**: Validates latitude/longitude ranges
- **API Key Validation**: Checks for required API keys

## 🔧 Configuration

The API supports different environments:
- **Development**: Debug mode enabled
- **Production**: Debug mode disabled
- **Testing**: Test mode enabled

Set `FLASK_ENV` environment variable to switch modes.

## 📱 Integration

This API can be easily integrated with:
- Web applications
- Mobile apps
- Other microservices
- Chatbots and voice assistants

## 🚀 Future Enhancements

- User authentication
- Rate limiting
- Request logging
- Database integration
- Real-time notifications
- Multi-language support
