# MyAssistant Backend API

A professional Node.js/Express backend for an AI-powered personal assistant application.

## Features

- **AI Integration**: Gemini API for intelligent responses
- **Authentication**: JWT-based secure authentication
- **File Upload**: Cloudinary integration for image handling
- **Smart Services**: Weather, NLP, and Smart Home integrations
- **Professional Security**: Rate limiting, CORS, security headers
- **Comprehensive Logging**: Request tracking and error monitoring
- **Health Monitoring**: System status and diagnostics

## Tech Stack

- **Node.js** (>=18.0.0)
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Gemini AI** - Language model
- **Natural** - NLP processing
- **Bcrypt** - Password hashing

## Quick Start

### Prerequisites

- Node.js (>=18.0.0)
- MongoDB database
- Cloudinary account
- Gemini API key

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

4. **Start the server**
   
   **Windows:**
   ```bash
   # Using batch file
   start.bat
   
   # Using PowerShell
   ./start.ps1
   
   # Using npm
   npm run dev
   ```
   
   **Linux/Mac:**
   ```bash
   npm run dev
   ```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | No | Environment (development/production) |
| `PORT` | No | Server port (default: 8000) |
| `MONGODB_URL` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `GEMINI_API_URL` | Yes | Gemini API endpoint with key |
| `WEATHER_API_KEY` | No | OpenWeatherMap API key (optional) |

## API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/signin` | User login |
| GET | `/auth/logout` | User logout |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/user/current` | Get current user | ✅ |
| POST | `/user/update` | Update assistant settings | ✅ |
| POST | `/user/update-settings` | Update user preferences | ✅ |
| POST | `/user/asktoassistant` | Chat with AI assistant | ✅ |

### System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/docs` | API documentation |

## Project Structure

```
backend/
├── config/
│   ├── cloudinary.js      # Cloudinary configuration
│   ├── db.js              # Database connection
│   └── token.js           # JWT utilities
├── controllers/
│   ├── auth.controllers.js # Authentication logic
│   └── user.controllers.js # User operations
├── middlewares/
│   ├── isAuth.js          # Authentication middleware
│   └── multer.js          # File upload middleware
├── models/
│   └── user.model.js      # User data model
├── routes/
│   ├── auth.routes.js     # Authentication routes
│   └── user.routes.js     # User routes
├── services/
│   ├── nlpService.js      # Natural language processing
│   ├── weatherService.js  # Weather integration
│   └── smartHomeService.js # Smart home controls
├── public/                # File upload directory
├── .env.example           # Environment template
├── .env                   # Environment variables
├── index.js               # Main server file
├── gemini.js              # AI integration
├── package.json           # Dependencies
├── start.bat              # Windows startup script
├── start.ps1              # PowerShell startup script
└── README.md              # This file
```

## Features & Services

### AI Assistant
- Gemini-powered responses
- Context-aware conversations
- Multi-language support
- Personality customization

### Security Features
- JWT authentication
- Password hashing
- CORS protection
- Rate limiting
- Security headers
- Input validation

### Monitoring & Logging
- Request logging with timing
- Error tracking
- Health status monitoring
- Memory usage tracking
- Database connectivity checks

### File Upload
- Cloudinary integration
- Image optimization
- Secure file handling
- Automatic cleanup

## Development

### Scripts

```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
```

### Health Check

Visit `http://localhost:8000/api/health` to check:
- Server status
- Database connectivity
- Memory usage
- Service configurations
- System information

### API Documentation

Visit `http://localhost:8000/api/docs` for interactive API documentation.

## Production Deployment

1. Set `NODE_ENV=production`
2. Update CORS origins for your domain
3. Use strong JWT secrets
4. Enable rate limiting
5. Set up proper logging
6. Configure SSL/HTTPS
7. Use environment-specific database

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   ```

2. **MongoDB connection issues**
   - Check MONGODB_URL in .env
   - Verify network connectivity
   - Check MongoDB Atlas whitelist

3. **Environment variables not loaded**
   - Ensure .env file exists
   - Check file encoding (UTF-8)
   - Restart the server

4. **Cloudinary upload fails**
   - Verify API credentials
   - Check file size limits
   - Ensure public/ directory exists

## Support

For issues and questions:
1. Check the health endpoint: `/api/health`
2. Review server logs
3. Verify environment configuration
4. Check network connectivity

## License

ISC License
