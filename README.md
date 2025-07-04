# 🤖 MyAssistant - Professional AI Assistant

A sophisticated full-stack AI assistant application built with the MERN stack, featuring advanced voice interactions, intelligent responses, and comprehensive smart services.

![MyAssistant Banner](./frontend/src/assets/github-header-image%20(14)_LE_upscale_balanced_x4%20(1).jpg)

## 🚀 Features

### 🧠 AI Capabilities
- **Advanced Conversational AI** - Powered by Google Gemini
- **Voice Recognition & Speech Synthesis** - Natural voice interactions
- **Multi-language Support** - Supports multiple languages and dialects
- **Context-Aware Responses** - Maintains conversation context
- **Personality Customization** - Adjustable AI personality modes

### 🌟 Smart Services
- **Weather Integration** - Real-time weather data and forecasts
- **News Feed** - Latest news from multiple categories
- **Email Management** - Mock email interface
- **Smart Home Dashboard** - Virtual smart home controls
- **Advanced Analytics** - User interaction insights

### 🎨 Professional UI/UX
- **Modern Design** - Glass morphism effects and smooth animations
- **Responsive Layout** - Works on all device sizes
- **Dark Theme** - Professional dark mode interface
- **Interactive Dashboard** - Comprehensive control center
- **Voice Visualizations** - Real-time voice activity indicators

### 🔒 Security & Performance
- **JWT Authentication** - Secure user authentication
- **Rate Limiting** - API protection and abuse prevention
- **Input Validation** - Comprehensive data validation
- **Error Handling** - Graceful error management
- **Security Headers** - Production-ready security measures

## 🛠 Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Advanced animations
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **Cloudinary** - Image upload and management
- **Natural** - Natural language processing
- **Helmet** - Security middleware

### AI & External Services
- **Google Gemini AI** - Advanced language model
- **OpenWeatherMap API** - Weather data (optional)
- **Web Speech API** - Voice recognition and synthesis

## 📦 Project Structure

```
MyAssistant/
├── backend/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   ├── public/            # File uploads
│   ├── .env.example       # Environment template
│   ├── README.md          # Backend documentation
│   └── package.json       # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── assets/        # Static assets
│   │   └── styles/        # CSS styles
│   ├── public/            # Public assets
│   └── package.json       # Frontend dependencies
├── FEATURES.md            # Detailed features documentation
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (>=18.0.0)
- **MongoDB** database (local or Atlas)
- **Git** version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/its-pratyushpandey/MyAssistant.git
   cd MyAssistant
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Setup Frontend** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api/docs

### Environment Configuration

Create `.env` file in the backend directory:

```env
# Required
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_URL=your_gemini_api_url_with_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Optional
WEATHER_API_KEY=your_weather_api_key
NODE_ENV=development
PORT=8000
```

## 📱 Usage Guide

### Getting Started
1. **Sign Up** - Create a new account
2. **Customize Assistant** - Choose AI avatar and name
3. **Configure Settings** - Adjust voice and AI preferences
4. **Start Chatting** - Use voice or text to interact

### Voice Commands
- **"Hey [Assistant Name]"** - Wake up the assistant
- **Weather queries** - "What's the weather like?"
- **General questions** - Ask anything you want to know
- **System controls** - "Open dashboard", "Show features"

### Dashboard Features
- **Weather Widget** - Current weather and 5-day forecast
- **News Feed** - Latest news from various categories
- **Email Interface** - Mock email management
- **Smart Home** - Virtual device controls
- **Analytics** - Usage statistics and insights

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm start           # Start production server
npm test            # Run tests (when available)
```

### Frontend Development
```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

### API Documentation
- **Health Check**: `GET /api/health`
- **API Docs**: `GET /api/docs`
- **Authentication**: `POST /api/auth/signup`, `POST /api/auth/signin`
- **User Operations**: `GET /api/user/current`, `POST /api/user/update`
- **AI Chat**: `POST /api/user/asktoassistant`

## 🌐 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Configure production MongoDB URL
3. Set strong JWT secrets
4. Deploy to your preferred platform (Heroku, Railway, Render, etc.)

### Frontend Deployment
1. Update API URL in production
2. Build the project: `npm run build`
3. Deploy to Vercel, Netlify, or similar platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Pratyush Pandey**
- GitHub: [@its-pratyushpandey](https://github.com/its-pratyushpandey)

## 🙏 Acknowledgments

- Google Gemini AI for intelligent responses
- OpenWeatherMap for weather data
- Cloudinary for image management
- MongoDB for database services
- All open-source contributors

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the [API documentation](http://localhost:8000/api/docs)
- Review the [Features documentation](./FEATURES.md)

---

⭐ **Star this repository if you found it helpful!**
