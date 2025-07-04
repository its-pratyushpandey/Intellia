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

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Gemini AI** - Language model

## 📂 Project Structure

```
MyAssistant/
├── backend/                # Backend API
│   ├── config/             # Configuration files
│   ├── controllers/        # API controllers
│   ├── middlewares/        # Middleware functions
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Service integrations
│   ├── public/             # Static files
│   ├── .env.example        # Environment variable template
│   ├── README.md           # Backend documentation
│   └── start.bat           # Windows startup script
├── frontend/               # Frontend application
│   ├── src/                # Source code
│   ├── public/             # Public assets
│   ├── README.md           # Frontend documentation
│   └── vite.config.js      # Vite configuration
└── README.md               # Project documentation
```

## 🎥 Demo

### AI Assistant Interaction
![AI Assistant Interaction](./frontend/src/assets/ai.gif)

### Smart Home Dashboard
![Smart Home Dashboard](./frontend/src/assets/user.gif)

### Weather Widget
![Weather Widget](./frontend/src/assets/image1.png)

## 🛠 Installation

### Prerequisites

- Node.js (>=18.0.0)
- MongoDB database
- Cloudinary account
- Gemini API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm run dev
   ```

## 📋 API Documentation

Visit `http://localhost:8000/api/docs` for interactive API documentation.

## 🩺 Health Check

Visit `http://localhost:8000/api/health` to check:
- Server status
- Database connectivity
- Memory usage
- Service configurations
- System information

## 🛡️ Security Features

- **JWT Authentication**
- **Rate Limiting**
- **Input Validation**
- **Error Handling**
- **Security Headers**

## 🖼️ Screenshots

### AI Assistant Interaction
![AI Assistant Interaction](./frontend/src/assets/ai.gif)

### Smart Home Dashboard
![Smart Home Dashboard](./frontend/src/assets/user.gif)

### Weather Widget
![Weather Widget](./frontend/src/assets/image1.png)

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the ISC License.
