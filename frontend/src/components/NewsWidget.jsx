import React, { useState, useEffect } from 'react';
import { 
  MdArticle, 
  MdRefresh, 
  MdTrendingUp, 
  MdAccessTime,
  MdShare,
  MdBookmark,
  MdOpenInNew
} from 'react-icons/md';
import { FiExternalLink } from 'react-icons/fi';
import { BiNews } from 'react-icons/bi';

const NewsWidget = ({ isMinimized = false }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [error, setError] = useState(null);

  const categories = [
    { id: 'general', name: 'General', icon: '📰' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'health', name: 'Health', icon: '🏥' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'sports', name: 'Sports', icon: '⚽' }
  ];

  // Mock news data for demonstration
  const mockNewsData = {
    general: [
      {
        id: 1,
        title: "Revolutionary AI Assistant Technology Advances",
        description: "Latest developments in AI assistant technology are changing how we interact with digital interfaces...",
        source: "Tech Today",
        publishedAt: "2 hours ago",
        category: "Technology",
        readTime: "3 min read",
        trending: true,
        image: "https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=AI+News"
      },
      {
        id: 2,
        title: "Smart Home Integration Reaches New Heights",
        description: "Home automation systems are becoming more intuitive and user-friendly with latest updates...",
        source: "Smart Living",
        publishedAt: "4 hours ago",
        category: "Technology",
        readTime: "2 min read",
        trending: false,
        image: "https://via.placeholder.com/300x200/50E3C2/FFFFFF?text=Smart+Home"
      },
      {
        id: 3,
        title: "Voice Recognition Technology Breakthrough",
        description: "New advances in voice recognition are making digital assistants more accurate and responsive...",
        source: "Voice Tech Weekly",
        publishedAt: "6 hours ago",
        category: "Technology",
        readTime: "4 min read",
        trending: true,
        image: "https://via.placeholder.com/300x200/BD10E0/FFFFFF?text=Voice+Tech"
      },
      {
        id: 4,
        title: "Future of Personal Assistant Applications",
        description: "Industry experts predict major changes in how personal assistants will evolve over the next decade...",
        source: "Future Tech",
        publishedAt: "8 hours ago",
        category: "Technology",
        readTime: "5 min read",
        trending: false,
        image: "https://via.placeholder.com/300x200/F5A623/FFFFFF?text=Future+AI"
      }
    ],
    technology: [
      {
        id: 5,
        title: "Machine Learning Models Show Impressive Progress",
        description: "Latest ML models demonstrate unprecedented accuracy in natural language processing tasks...",
        source: "ML Review",
        publishedAt: "1 hour ago",
        category: "Technology",
        readTime: "6 min read",
        trending: true,
        image: "https://via.placeholder.com/300x200/7ED321/FFFFFF?text=ML+Progress"
      },
      {
        id: 6,
        title: "Cloud Computing Infrastructure Innovations",
        description: "New cloud technologies are enabling faster and more efficient AI processing capabilities...",
        source: "Cloud Tech",
        publishedAt: "3 hours ago",
        category: "Technology",
        readTime: "4 min read",
        trending: false,
        image: "https://via.placeholder.com/300x200/417505/FFFFFF?text=Cloud+Tech"
      }
    ]
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setNews(mockNewsData[selectedCategory] || mockNewsData.general);
        setLoading(false);
        setError(null);
      }, 800);
    } catch (err) {
      setError('Failed to fetch news');
      setLoading(false);
    }
  };

  const formatTimeAgo = (timeString) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="news-widget bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-white/20 rounded w-32"></div>
            <div className="h-8 w-8 bg-white/20 rounded-full"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4">
                <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-white/20 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-widget bg-red-500/20 backdrop-blur-md rounded-2xl p-6 border border-red-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">News Error</h3>
          <button onClick={fetchNews} className="text-white hover:text-red-400">
            <MdRefresh className="w-5 h-5" />
          </button>
        </div>
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="news-widget-mini bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BiNews className="text-blue-400 w-5 h-5" />
            <span className="text-white font-semibold">Latest News</span>
          </div>
          <span className="text-xs text-gray-400">{news.length} articles</span>
        </div>
        <div className="space-y-2">
          {news.slice(0, 2).map((article) => (
            <div key={article.id} className="text-sm">
              <div className="text-white font-medium line-clamp-1">{article.title}</div>
              <div className="text-gray-400 text-xs flex items-center gap-2">
                <span>{article.source}</span>
                <span>•</span>
                <span>{article.publishedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="news-widget bg-gradient-to-br from-purple-500/20 to-blue-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BiNews className="text-purple-400 w-6 h-6" />
          <h3 className="text-white font-semibold text-lg">Latest News</h3>
        </div>
        <button 
          onClick={fetchNews}
          className="text-white hover:text-purple-400 transition-colors p-2 hover:bg-white/10 rounded-full"
        >
          <MdRefresh className="w-5 h-5" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            }`}
          >
            <span>{category.icon}</span>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      {/* News Articles */}
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {news.map((article) => (
          <div key={article.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group">
            <div className="flex gap-4">
              {/* Article Image */}
              <div className="flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/30 to-blue-500/30">
                <div className="w-full h-full flex items-center justify-center">
                  <MdArticle className="w-8 h-8 text-white/60" />
                </div>
              </div>

              {/* Article Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-white font-semibold text-sm lg:text-base line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {article.trending && (
                      <MdTrendingUp className="w-4 h-4 text-orange-400" />
                    )}
                    <button className="text-gray-400 hover:text-white p-1">
                      <MdBookmark className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-white p-1">
                      <MdShare className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                  {article.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="font-medium text-purple-300">{article.source}</span>
                    <div className="flex items-center gap-1">
                      <MdAccessTime className="w-3 h-3" />
                      <span>{article.publishedAt}</span>
                    </div>
                    <span>{article.readTime}</span>
                  </div>
                  
                  <button className="flex items-center gap-1 text-xs text-purple-300 hover:text-purple-200 transition-colors">
                    <span>Read more</span>
                    <FiExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">{news.length} articles loaded</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 text-sm">
              View All
            </button>
            <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 text-sm">
              Customize Feed
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .news-widget {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .news-widget:hover {
          transform: translateY(-2px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #8b5cf6, #3b82f6);
          border-radius: 2px;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default NewsWidget;
