import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart, 
  MessageCircle, 
  Share,
  Eye,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const metrics = [
    { name: 'Total Followers', value: '24.5K', change: '+12.3%', trend: 'up', icon: Users },
    { name: 'Engagement Rate', value: '4.8%', change: '+0.8%', trend: 'up', icon: Heart },
    { name: 'Total Reach', value: '156K', change: '-2.1%', trend: 'down', icon: Eye },
    { name: 'Posts Published', value: '48', change: '+25%', trend: 'up', icon: MessageCircle },
  ];

  const platformStats = [
    {
      platform: 'Twitter',
      icon: Twitter,
      color: 'text-blue-500 bg-blue-50',
      followers: '12.5K',
      engagement: '5.2%',
      posts: 18,
      reach: '68K'
    },
    {
      platform: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700 bg-blue-50',
      followers: '8.3K',
      engagement: '4.1%',
      posts: 15,
      reach: '45K'
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      color: 'text-pink-500 bg-pink-50',
      followers: '3.7K',
      engagement: '6.3%',
      posts: 15,
      reach: '43K'
    },
  ];

  const topPosts = [
    {
      id: 1,
      content: "Just launched our new AI-powered content creation feature! 🚀 Creating engaging social media content has never been easier.",
      platform: 'twitter',
      likes: 245,
      shares: 67,
      comments: 28,
      reach: '12.5K'
    },
    {
      id: 2,
      content: "Behind the scenes: How AI is revolutionizing social media management. Our latest blog post dives deep...",
      platform: 'linkedin',
      likes: 189,
      shares: 45,
      comments: 34,
      reach: '8.9K'
    },
    {
      id: 3,
      content: "Tips for creating authentic content that resonates with your audience. Swipe to see our top 5 strategies! ✨",
      platform: 'instagram',
      likes: 312,
      shares: 89,
      comments: 56,
      reach: '15.2K'
    },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'linkedin': return <Linkedin className="h-5 w-5" />;
      case 'instagram': return <Instagram className="h-5 w-5" />;
      default: return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'text-blue-500 bg-blue-50';
      case 'linkedin': return 'text-blue-700 bg-blue-50';
      case 'instagram': return 'text-pink-500 bg-pink-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">Track your social media performance and engagement</p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <div className={`flex items-center ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium ml-1">{metric.change}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Platform Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Platform Performance</h2>
          <div className="space-y-4">
            {platformStats.map((platform) => {
              const Icon = platform.icon;
              return (
                <div key={platform.platform} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${platform.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-gray-900">{platform.platform}</span>
                    </div>
                    <span className="text-sm text-gray-500">{platform.posts} posts</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{platform.followers}</p>
                      <p className="text-xs text-gray-500">Followers</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{platform.engagement}</p>
                      <p className="text-xs text-gray-500">Engagement</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{platform.reach}</p>
                      <p className="text-xs text-gray-500">Reach</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Engagement Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Engagement Over Time</h2>
          <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-indigo-400 mx-auto mb-3" />
              <p className="text-gray-600">Chart visualization would go here</p>
              <p className="text-sm text-gray-500 mt-1">Interactive charts showing engagement trends</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Posts</h2>
        <div className="space-y-4">
          {topPosts.map((post) => (
            <div key={post.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded ${getPlatformColor(post.platform)}`}>
                    {getPlatformIcon(post.platform)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 capitalize">{post.platform}</span>
                </div>
                <span className="text-sm text-gray-500 flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {post.reach}
                </span>
              </div>
              
              <p className="text-gray-900 mb-4 line-clamp-2">{post.content}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share className="h-4 w-4" />
                  <span>{post.shares}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};