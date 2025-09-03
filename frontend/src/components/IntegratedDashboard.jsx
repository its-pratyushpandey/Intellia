import React, { useState } from 'react';

import { 
  MdDashboard, 
  MdSettings, 
  MdFullscreen, 
  MdFullscreenExit,
  MdViewModule,
  MdViewList,
  MdRefresh
} from 'react-icons/md';
import { FiGrid, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import WeatherWidget from './WeatherWidget';
import NewsWidget from './NewsWidget';
import EmailWidget from './EmailWidget';

const IntegratedDashboard = ({ onClose }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'focus'
  const [focusedWidget, setFocusedWidget] = useState(null);
  const [minimizedWidgets, setMinimizedWidgets] = useState(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const widgets = [
    {
      id: 'weather',
      title: 'Weather Forecast',
      component: WeatherWidget,
      color: 'from-blue-500/20 to-cyan-500/20',
      icon: '🌤️'
    },
    {
      id: 'news',
      title: 'News Feed',
      component: NewsWidget,
      color: 'from-purple-500/20 to-pink-500/20',
      icon: '📰'
    },
    {
      id: 'email',
      title: 'Email',
      component: EmailWidget,
      color: 'from-indigo-500/20 to-blue-500/20',
      icon: '📧'
    }
  ];

  const toggleWidgetMinimize = (widgetId) => {
    const newMinimized = new Set(minimizedWidgets);
    if (newMinimized.has(widgetId)) {
      newMinimized.delete(widgetId);
    } else {
      newMinimized.add(widgetId);
    }
    setMinimizedWidgets(newMinimized);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const refreshAllWidgets = () => {
    // Trigger refresh for all widgets
    window.dispatchEvent(new CustomEvent('refreshWidgets'));
  };

  if (focusedWidget) {
    const FocusedComponent = widgets.find(w => w.id === focusedWidget)?.component;
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-black via-blue-950 to-purple-950 z-50">
        <div className="h-full flex flex-col">
          {/* Focus Mode Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFocusedWidget(null)}
                className="p-2 text-white hover:text-blue-400 transition-colors hover:bg-white/10 rounded-full"
              >
                <MdViewModule className="w-5 h-5" />
              </button>
              <h2 className="text-white text-xl font-bold">
                {widgets.find(w => w.id === focusedWidget)?.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-2 text-white hover:text-blue-400 transition-colors hover:bg-white/10 rounded-full"
              >
                {isFullscreen ? <MdFullscreenExit className="w-5 h-5" /> : <MdFullscreen className="w-5 h-5" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-white hover:text-red-400 transition-colors hover:bg-white/10 rounded-full"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Focused Widget */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              {FocusedComponent && <FocusedComponent isMinimized={false} />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-blue-950 to-purple-950 z-50 overflow-auto">
      <div className="min-h-full">
        {/* Dashboard Header */}
        <div className="sticky top-0 bg-black/20 backdrop-blur-xl border-b border-white/10 z-40">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <MdDashboard className="text-blue-400 w-8 h-8" />
                <h1 className="text-white text-2xl font-bold">Professional Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Controls */}
              <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  title="Grid View"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  title="List View"
                >
                  <MdViewList className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={refreshAllWidgets}
                className="p-2 text-white hover:text-blue-400 transition-colors hover:bg-white/10 rounded-full"
                title="Refresh All"
              >
                <MdRefresh className="w-5 h-5" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 text-white hover:text-blue-400 transition-colors hover:bg-white/10 rounded-full"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <MdFullscreenExit className="w-5 h-5" /> : <MdFullscreen className="w-5 h-5" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 text-white hover:text-red-400 transition-colors hover:bg-white/10 rounded-full"
                title="Close Dashboard"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {widgets.map((widget) => {
                const WidgetComponent = widget.component;
                const isMinimized = minimizedWidgets.has(widget.id);
                
                return (
                  <div
                    key={widget.id}
                    className={`relative group transition-all duration-300 ${
                      isMinimized ? 'col-span-1' : 'col-span-1'
                    }`}
                  >
                    {/* Widget Controls */}
                    <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg p-1">
                        <button
                          onClick={() => toggleWidgetMinimize(widget.id)}
                          className="p-1.5 text-white hover:text-blue-400 transition-colors hover:bg-white/20 rounded"
                          title={isMinimized ? "Expand" : "Minimize"}
                        >
                          {isMinimized ? <FiMaximize2 className="w-3 h-3" /> : <FiMinimize2 className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => setFocusedWidget(widget.id)}
                          className="p-1.5 text-white hover:text-blue-400 transition-colors hover:bg-white/20 rounded"
                          title="Focus Mode"
                        >
                          <MdFullscreen className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <WidgetComponent isMinimized={isMinimized} />
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {widgets.map((widget) => {
                const WidgetComponent = widget.component;
                const isMinimized = minimizedWidgets.has(widget.id);
                
                return (
                  <div key={widget.id} className="relative group">
                    {/* Widget Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{widget.icon}</span>
                        <h3 className="text-white text-lg font-semibold">{widget.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleWidgetMinimize(widget.id)}
                          className="p-2 text-white hover:text-blue-400 transition-colors hover:bg-white/10 rounded-full"
                          title={isMinimized ? "Expand" : "Minimize"}
                        >
                          {isMinimized ? <FiMaximize2 className="w-4 h-4" /> : <FiMinimize2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setFocusedWidget(widget.id)}
                          className="p-2 text-white hover:text-blue-400 transition-colors hover:bg-white/10 rounded-full"
                          title="Focus Mode"
                        >
                          <MdFullscreen className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <WidgetComponent isMinimized={isMinimized} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-xl border-t border-white/10 p-4">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">All systems operational</span>
            </div>
            <div className="text-gray-400 text-sm">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <div className="text-gray-400 text-sm">
              {widgets.length} widgets active
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Smooth animations */
        .widget-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Custom scrollbar for dashboard */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563eb, #7c3aed);
        }

        /* Glass morphism effects */
        .glass-card {
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default IntegratedDashboard;
