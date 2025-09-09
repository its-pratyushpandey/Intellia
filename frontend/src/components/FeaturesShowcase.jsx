import React, { useState } from 'react';

import { 
  MdDashboard, 
  MdWbSunny, 
  MdArticle, 
  MdEmail,
  MdMic,
  MdVolumeUp,
  MdTranslate,
  MdPsychology,
  MdSettings,
  MdClose
} from 'react-icons/md';
import { FiFeather } from 'react-icons/fi';
import WeatherWidget from './WeatherWidget';
import NewsWidget from './NewsWidget';
import EmailWidget from './EmailWidget';
const FeaturesShowcase = ({ onClose }) => {
  const [activeDemo, setActiveDemo] = useState(null);

  const features = [
    {
      id: 'weather',
      title: 'Advanced Weather Widget',
      icon: <MdWbSunny className="w-8 h-8" />,
      description: 'Comprehensive weather information with 5-day forecast, detailed metrics, and beautiful visualizations.',
      color: 'from-blue-500 to-cyan-500',
      component: WeatherWidget,
      highlights: ['5-day forecast', 'Real-time data', 'Beautiful UI', 'Responsive design']
    },
    {
      id: 'news',
      title: 'Smart News Feed',
      icon: <MdArticle className="w-8 h-8" />,
      description: 'Personalized news feed with categorization, trending topics, and intelligent content filtering.',
      color: 'from-purple-500 to-pink-500',
      component: NewsWidget,
      highlights: ['Multiple categories', 'Trending articles', 'Smart filtering', 'Clean layout']
    },
    {
      id: 'email',
      title: 'Professional Email Client',
      icon: <MdEmail className="w-8 h-8" />,
      description: 'Full-featured email management with compose, reply, and advanced organization tools.',
      color: 'from-indigo-500 to-blue-500',
      component: EmailWidget,
      highlights: ['Full email management', 'Compose & reply', 'Smart organization', 'Responsive interface']
    },
    {
      id: 'voice',
      title: 'Advanced Voice Control',
      icon: <MdMic className="w-8 h-8" />,
      description: 'Sophisticated voice recognition with multi-language support and natural conversation flow.',
      color: 'from-green-500 to-emerald-500',
      highlights: ['Multi-language support', 'Natural conversation', 'Voice customization', 'Smart recognition']
    },
    {
      id: 'ai',
      title: 'Intelligent AI Assistant',
      icon: <MdPsychology className="w-8 h-8" />,
      description: 'Context-aware AI with emotional intelligence, learning capabilities, and personality customization.',
      color: 'from-orange-500 to-red-500',
      highlights: ['Emotional intelligence', 'Context awareness', 'Learning mode', 'Personality types']
    },
    {
      id: 'dashboard',
      title: 'Professional Dashboard',
      icon: <MdDashboard className="w-8 h-8" />,
      description: 'Unified interface bringing together all features with customizable layouts and real-time updates.',
      color: 'from-violet-500 to-purple-500',
      highlights: ['Unified interface', 'Customizable layout', 'Real-time updates', 'Professional design']
    }
  ];

  const DemoComponent = activeDemo ? features.find(f => f.id === activeDemo)?.component : null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-blue-950 to-purple-950 z-50 overflow-auto">
      <div className="min-h-full">
        {/* Header */}
        <div className="sticky top-0 bg-black/20 backdrop-blur-xl border-b border-white/10 z-40">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <FiFeather className="text-blue-400 w-8 h-8" />
              <h1 className="text-white text-2xl font-bold">Professional Features</h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white hover:text-red-400 transition-colors hover:bg-white/10 rounded-full"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Demo Modal */}
        {activeDemo && DemoComponent && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-xl">
                    {features.find(f => f.id === activeDemo)?.title} Demo
                  </h3>
                  <button
                    onClick={() => setActiveDemo(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <MdClose className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-auto max-h-[70vh]">
                <DemoComponent />
              </div>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Introduction */}
            <div className="text-center mb-12">
              <h2 className="text-white text-4xl font-bold mb-4">
                Professional Assistant Features
              </h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                Experience the future of digital assistance with our comprehensive suite of 
                professional-grade features designed for productivity and seamless interaction.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="group relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105"
                >
                  {/* Feature Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Feature Content */}
                  <h3 className="text-white text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6">
                    {feature.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-400">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {feature.component && (
                      <button
                        onClick={() => setActiveDemo(feature.id)}
                        className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        Live Demo
                      </button>
                    )}
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm">
                      Learn More
                    </button>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Statistics */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-12">
              <h3 className="text-white text-2xl font-bold mb-8 text-center">
                Platform Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
                  <div className="text-gray-300 text-sm">Languages Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">99.9%</div>
                  <div className="text-gray-300 text-sm">Uptime Reliability</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">50+</div>
                  <div className="text-gray-300 text-sm">Voice Commands</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
                  <div className="text-gray-300 text-sm">AI Assistance</div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <h3 className="text-white text-2xl font-bold mb-4">
                Ready to Experience Professional AI Assistance?
              </h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Get started with our comprehensive suite of features designed to enhance 
                your productivity and streamline your digital interactions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                >
                  Start Using Features
                </button>
                <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-colors">
                  View Documentation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Custom animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Gradient animations */
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default FeaturesShowcase;
