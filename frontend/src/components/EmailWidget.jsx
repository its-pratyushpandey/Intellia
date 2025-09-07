import React, { useState, useEffect } from 'react';
import { 
  MdEmail, 
  MdInbox, 
  MdSend, 
  MdDrafts,
  MdStar,
  MdStarBorder,
  MdAttachment,
  MdRefresh,
  MdSearch,
  MdAdd,
  MdArchive,
  MdDelete,
  MdReply,
  MdForward,
  MdClose
} from 'react-icons/md';
import { FiPaperclip, FiUser, FiClock } from 'react-icons/fi';
import { BiSend } from 'react-icons/bi';

const EmailWidget = ({ isMinimized = false }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [activeTab, setActiveTab] = useState('inbox');
  const [isComposing, setIsComposing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // Mock email data for demonstration
  const mockEmailData = {
    inbox: [
      {
        id: 1,
        from: 'Sarah Johnson',
        fromEmail: 'sarah.johnson@company.com',
        subject: 'Project Update - Q4 Requirements',
        preview: 'Hi there! I wanted to share the latest updates on our Q4 project requirements. We\'ve made significant progress...',
        body: 'Hi there!\n\nI wanted to share the latest updates on our Q4 project requirements. We\'ve made significant progress on the initial phases and I think you\'ll be pleased with the results.\n\nKey highlights:\n- User interface improvements\n- Performance optimizations\n- New feature implementations\n\nLet me know if you have any questions!\n\nBest regards,\nSarah',
        time: '2:30 PM',
        date: 'Today',
        read: false,
        starred: true,
        hasAttachment: true,
        priority: 'high',
        category: 'work'
      },
      {
        id: 2,
        from: 'Tech Newsletter',
        fromEmail: 'newsletter@techtoday.com',
        subject: 'Weekly Tech Digest - AI Advances',
        preview: 'This week in technology: Revolutionary AI breakthroughs, new development tools, and industry insights...',
        body: 'This week in technology brings exciting developments in AI and machine learning. Here are the top stories you shouldn\'t miss...',
        time: '11:45 AM',
        date: 'Today',
        read: true,
        starred: false,
        hasAttachment: false,
        priority: 'normal',
        category: 'newsletter'
      },
      {
        id: 3,
        from: 'Mike Chen',
        fromEmail: 'mike.chen@startup.io',
        subject: 'Meeting Confirmation - Tomorrow 3PM',
        preview: 'Just confirming our meeting tomorrow at 3PM. Looking forward to discussing the new collaboration...',
        body: 'Hi!\n\nJust confirming our meeting tomorrow at 3PM. I\'ve prepared some materials to share and I\'m looking forward to discussing the new collaboration opportunities.\n\nSee you tomorrow!\nMike',
        time: '9:15 AM',
        date: 'Today',
        read: false,
        starred: false,
        hasAttachment: false,
        priority: 'normal',
        category: 'meetings'
      },
      {
        id: 4,
        from: 'Assistant AI',
        fromEmail: 'ai@assistant.com',
        subject: 'Your Daily Summary',
        preview: 'Here\'s your personalized daily summary with important updates and reminders...',
        body: 'Good morning!\n\nHere\'s your personalized daily summary:\n\n• 3 new emails requiring attention\n• 2 calendar events today\n• Weather: Sunny, 72°F\n• Reminder: Project deadline tomorrow\n\nHave a productive day!',
        time: '8:00 AM',
        date: 'Today',
        read: true,
        starred: true,
        hasAttachment: false,
        priority: 'normal',
        category: 'assistant'
      }
    ],
    sent: [],
    drafts: [],
    starred: []
  };

  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  useEffect(() => {
    fetchEmails();
  }, [activeTab]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const emailList = mockEmailData[activeTab] || mockEmailData.inbox;
        setEmails(emailList);
        setLoading(false);
        setError(null);
      }, 500);
    } catch (err) {
      setError('Failed to fetch emails');
      setLoading(false);
    }
  };

  const handleStarEmail = (emailId) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  };

  const handleMarkAsRead = (emailId) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, read: true } : email
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'work': return '💼';
      case 'personal': return '👤';
      case 'newsletter': return '📰';
      case 'meetings': return '📅';
      case 'assistant': return '🤖';
      default: return '📧';
    }
  };

  if (loading) {
    return (
      <div className="email-widget bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-white/20 rounded w-32"></div>
            <div className="h-8 w-8 bg-white/20 rounded-full"></div>
          </div>
          <div className="space-y-3">
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
      <div className="email-widget bg-red-500/20 backdrop-blur-md rounded-2xl p-6 border border-red-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Email Error</h3>
          <button onClick={fetchEmails} className="text-white hover:text-red-400">
            <MdRefresh className="w-5 h-5" />
          </button>
        </div>
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  if (isMinimized) {
    const unreadCount = emails.filter(email => !email.read).length;
    return (
      <div className="email-widget-mini bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MdEmail className="text-blue-400 w-5 h-5" />
            <span className="text-white font-semibold">Email</span>
          </div>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="space-y-2">
          {emails.slice(0, 2).map((email) => (
            <div key={email.id} className="text-sm">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${email.read ? 'text-gray-300' : 'text-white'}`}>
                  {email.from}
                </span>
                <span className="text-xs text-gray-400">{email.time}</span>
              </div>
              <div className="text-gray-400 text-xs line-clamp-1">{email.subject}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="email-widget bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MdEmail className="text-blue-400 w-6 h-6" />
            <h3 className="text-white font-semibold text-lg">Email</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsComposing(true)}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
              title="Compose Email"
            >
              <MdAdd className="w-4 h-4" />
            </button>
            <button 
              onClick={fetchEmails}
              className="p-2 text-white hover:text-blue-400 transition-colors hover:bg-white/10 rounded-full"
              title="Refresh"
            >
              <MdRefresh className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {[
            { id: 'inbox', name: 'Inbox', icon: MdInbox },
            { id: 'sent', name: 'Sent', icon: MdSend },
            { id: 'drafts', name: 'Drafts', icon: MdDrafts },
            { id: 'starred', name: 'Starred', icon: MdStar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.name}</span>
              {tab.id === 'inbox' && emails.filter(e => !e.read).length > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {emails.filter(e => !e.read).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Email List */}
      <div className="h-80 overflow-y-auto custom-scrollbar">
        {emails.length === 0 ? (
          <div className="p-6 text-center">
            <MdInbox className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No emails in {activeTab}</p>
          </div>
        ) : (
          <div className="p-2">
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => {
                  setSelectedEmail(email);
                  handleMarkAsRead(email.id);
                }}
                className={`p-4 rounded-xl mb-2 cursor-pointer transition-all duration-200 group ${
                  email.read ? 'bg-white/5 hover:bg-white/10' : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${email.read ? 'text-gray-300' : 'text-white'}`}>
                          {email.from}
                        </span>
                        <span className="text-xs">{getCategoryIcon(email.category)}</span>
                        {email.hasAttachment && (
                          <FiPaperclip className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{email.time}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarEmail(email.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {email.starred ? (
                            <MdStar className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <MdStarBorder className="w-4 h-4 text-gray-400 hover:text-yellow-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className={`text-sm mb-1 ${email.read ? 'text-gray-400' : 'text-white'}`}>
                      {email.subject}
                    </div>
                    
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {email.preview}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/20 w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">{selectedEmail.subject}</h3>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{selectedEmail.from}</div>
                  <div className="text-gray-400 text-sm">{selectedEmail.fromEmail}</div>
                </div>
                <div className="text-gray-400 text-sm">
                  {selectedEmail.date} at {selectedEmail.time}
                </div>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="text-gray-300 whitespace-pre-line">
                {selectedEmail.body}
              </div>
            </div>
            
            <div className="p-6 border-t border-white/10">
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  <MdReply className="w-4 h-4" />
                  Reply
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  <MdForward className="w-4 h-4" />
                  Forward
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  <MdArchive className="w-4 h-4" />
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compose Modal */}
      {isComposing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/20 w-full max-w-2xl">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">Compose Email</h3>
                <button
                  onClick={() => setIsComposing(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <MdClose className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <input
                type="email"
                placeholder="To"
                value={composeData.to}
                onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              
              <input
                type="text"
                placeholder="Subject"
                value={composeData.subject}
                onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              
              <textarea
                placeholder="Compose your message..."
                value={composeData.body}
                onChange={(e) => setComposeData({...composeData, body: e.target.value})}
                rows="8"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>
            
            <div className="p-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                  <MdAttachment className="w-4 h-4" />
                  Attach File
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsComposing(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <BiSend className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .email-widget {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .email-widget:hover {
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
          background: linear-gradient(45deg, #3b82f6, #6366f1);
          border-radius: 2px;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default EmailWidget;
