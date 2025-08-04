# 🤖 MyAssistant - Professional AI Assistant

A sophisticated full-stack AI assistant application built using the MERN stack, delivering advanced voice interactions, intelligent responses, and a suite of smart services tailored for professional and personal productivity.

---

## 🚀 Features

### 🧠 AI Capabilities
- **Advanced Conversational AI**: Seamless conversations powered by Google Gemini.
- **Voice Recognition & Speech Synthesis**: Natural and responsive voice interactions.
- **Multi-language Support**: Communicate in multiple languages and dialects.
- **Context-Aware Responses**: Maintains context for smarter replies.
- **Personality Customization**: Adjustable AI personality to suit your preferences.

### 🌟 Smart Services
- **Weather Integration**: Real-time weather updates and forecasts.
- **News Feed**: Stay updated with the latest news across categories.
- **Email Management**: Mock email interface for demonstration.
- **Smart Home Dashboard**: Virtual controls for smart home devices.
- **Advanced Analytics**: Gain insights into user interactions.

### 🎨 Professional UI/UX
- **Modern Design**: Glassmorphism effects and smooth animations.
- **Responsive Layout**: Fully optimized for all device sizes.
- **Dark Theme**: Experience a sleek and professional dark mode.
- **Interactive Dashboard**: Comprehensive and intuitive control center.
- **Voice Visualizations**: Real-time indicators for voice activity.

### 🔒 Security & Performance
- **JWT Authentication**: Secure user authentication.
- **Rate Limiting**: API protection against abuse.
- **Input Validation**: Comprehensive data validation to enhance security.
- **Error Handling**: Graceful and user-friendly error management.
- **Security Headers**: Production-ready security measures.

---

## 🛠 Tech Stack

### Frontend
- **React 19**: Leveraging the latest features of React.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **Framer Motion**: Advanced animations for a polished UI.
- **Axios**: HTTP client for API requests.
- **React Router**: Efficient client-side routing.

### Backend
- **Node.js**: Robust JavaScript runtime environment.
- **Express.js**: Lightweight and flexible web application framework.
- **MongoDB**: NoSQL database with Mongoose ODM.
- **JWT**: JSON Web Token for secure authentication.
- **Cloudinary**: Cloud-based image upload and management.
- **Natural**: Natural language processing library.
- **Helmet**: Security middleware for enhanced protection.

### AI & External Services
- **Google Gemini AI**: Advanced conversational AI model.
- **OpenWeatherMap API**: Real-time weather data (optional).
- **Web Speech API**: Voice recognition and synthesis.

---

## 📦 Project Structure

```
MyAssistant/
├── backend/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   ├── public/             # File uploads
│   ├── .env.example        # Environment template
│   ├── README.md           # Backend documentation
│   └── package.json        # Backend dependencies
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context API
│   │   ├── assets/         # Static assets
│   │   └── styles/         # CSS styles
│   ├── public/             # Public assets
│   └── package.json        # Frontend dependencies
├── FEATURES.md             # Detailed features documentation
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

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

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Documentation: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

### Environment Configuration

Create a `.env` file in the backend directory:

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

---

## 📱 Usage Guide

### Getting Started
1. **Sign Up**: Create a new account.
2. **Customize Assistant**: Choose an AI avatar and name.
3. **Configure Settings**: Adjust voice and AI preferences.
4. **Start Chatting**: Use voice or text to interact.

### Voice Commands
- **"Hey [Assistant Name]"**: Wake up the assistant.
- **Weather queries**: "What's the weather like?"
- **General questions**: Ask anything you want to know.
- **System controls**: "Open dashboard", "Show features".

### Dashboard Features
- **Weather Widget**: Current weather and 5-day forecast.
- **News Feed**: Latest news from various categories.
- **Email Interface**: Mock email management.
- **Smart Home**: Virtual device controls.
- **Analytics**: Usage statistics and insights.

---

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run tests (when available)
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### API Documentation
- **Health Check**: `GET /api/health`
- **API Docs**: `GET /api/docs`
- **Authentication**: `POST /api/auth/signup`, `POST /api/auth/signin`
- **User Operations**: `GET /api/user/current`, `POST /api/user/update`
- **AI Chat**: `POST /api/user/asktoassistant`

---

## 🌐 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`.
2. Configure the production MongoDB URL.
3. Set strong JWT secrets.
4. Deploy to your preferred platform (Heroku, Railway, Render, etc.).

### Frontend Deployment
1. Update the API URL for production.
2. Build the project: `npm run build`.
3. Deploy to Vercel, Netlify, or a similar platform.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes: `git commit -m 'Add amazing feature'`.
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Pratyush Pandey**  
- GitHub: [@its-pratyushpandey](https://github.com/its-pratyushpandey)

---

## 🙏 Acknowledgments

- Google Gemini AI for intelligent responses.
- OpenWeatherMap for weather data.
- Cloudinary for image management.
- MongoDB for database services.
- All open-source contributors.

---

## 📞 Support

For support and questions:
- Create an issue on GitHub.
- Check the [API documentation](http://localhost:8000/api/docs).
- Review the [Features documentation](./FEATURES.md).

---

⭐ **Star this repository if you found it helpful!**
