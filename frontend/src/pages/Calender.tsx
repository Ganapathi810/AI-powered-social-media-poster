import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock,
  Edit,
  Trash2
} from 'lucide-react';
import { FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa6';

interface ScheduledPost {
  id: number;
  date: string;
  time: string;
  content: string;
  platform: 'twitter' | 'linkedin' | 'instagram';
  type: 'dynamic' | 'static';
  status: 'scheduled' | 'published' | 'failed';
}

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [setSelectedDate] = useState<Date | null>(null);
  // const [setShowAddPost] = useState(false);
  
  const scheduledPosts: ScheduledPost[] = [
    {
      id: 1,
      date: '2024-01-15',
      time: '10:00',
      content: 'Just launched our new AI-powered content creation feature! 🚀',
      platform: 'twitter',
      type: 'dynamic',
      status: 'scheduled'
    },
    {
      id: 2,
      date: '2024-01-16',
      time: '14:30',
      content: 'Behind the scenes: How AI is revolutionizing social media management.',
      platform: 'linkedin',
      type: 'static',
      status: 'scheduled'
    },
    {
      id: 3,
      date: '2024-01-18',
      time: '09:15',
      content: 'Tips for creating authentic content that resonates ✨',
      platform: 'instagram',
      type: 'dynamic',
      status: 'scheduled'
    }
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getPostsForDate = (date: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return scheduledPosts.filter(post => post.date === dateStr);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <FaTwitter className="h-3 w-3" />;
      case 'linkedin': return <FaLinkedin className="h-3 w-3" />;
      case 'instagram': return <FaInstagram className="h-3 w-3" />;
      default: return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'bg-blue-500';
      case 'linkedin': return 'bg-blue-700';
      case 'instagram': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-32 bg-gray-50 border border-gray-200"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const posts = getPostsForDate(day);
      const isToday = 
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={`h-32 border border-gray-200 p-2 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
            isToday ? 'bg-blue-50 border-blue-200' : 'bg-white'
          }`}
          onClick={() => {}}
        >
          <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {posts.slice(0, 2).map((post) => (
              <div
                key={post.id}
                className={`px-2 py-1 rounded text-xs text-white truncate flex items-center space-x-1 ${getPlatformColor(post.platform)}`}
              >
                {getPlatformIcon(post.platform)}
                <span>{post.time}</span>
              </div>
            ))}
            {posts.length > 2 && (
              <div className="text-xs text-gray-500 px-2">+{posts.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
          <p className="mt-2 text-gray-600">Schedule and manage your social media posts</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => {}}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Schedule Post
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {dayNames.map((day) => (
            <div key={day} className="px-4 py-3 text-center text-sm font-medium text-gray-700 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 ">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {scheduledPosts.filter(post => post.date === new Date().toISOString().split('T')[0]).length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No posts scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledPosts
                .filter(post => post.date === new Date().toISOString().split('T')[0])
                .map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg text-white ${getPlatformColor(post.platform)}`}>
                        {getPlatformIcon(post.platform)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{post.time}</p>
                        <p className="text-sm text-gray-600 line-clamp-1">{post.content}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.type === 'dynamic' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {post.type}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {post.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};