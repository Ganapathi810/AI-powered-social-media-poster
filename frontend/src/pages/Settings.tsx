import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Globe, 
  Key,
  Shield,
} from 'lucide-react';
import { FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa6';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    postScheduled: true,
    postPublished: true,
    accountConnected: true,
    weeklyReport: false,
    monthlyReport: true,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'accounts', label: 'Social Accounts', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Palette },
  ];

  const connectedAccounts = [
    {
      platform: 'twitter',
      username: '@yourbrand',
      connected: true,
      connectedAt: '2024-01-10',
      status: 'active'
    },
    {
      platform: 'linkedin',
      username: 'Your Brand',
      connected: true,
      connectedAt: '2024-01-12',
      status: 'active'
    },
    {
      platform: 'instagram',
      username: '@yourbrand',
      connected: false,
      connectedAt: null,
      status: 'disconnected'
    },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <FaTwitter className="h-5 w-5" />;
      case 'linkedin': return <FaLinkedin className="h-5 w-5" />;
      case 'instagram': return <FaInstagram className="h-5 w-5" />;
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

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            defaultValue="John"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            defaultValue="Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          defaultValue="john.doe@example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Business/Brand Name</label>
        <input
          type="text"
          defaultValue="Your Brand"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          rows={3}
          defaultValue="Passionate about creating engaging content and building meaningful connections through social media."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderSocialAccounts = () => (
    <div className="space-y-6">
      <p className="text-gray-600">Connect your social media accounts to enable posting and analytics</p>
      
      <div className="space-y-4">
        {connectedAccounts.map((account) => (
          <div key={account.platform} className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getPlatformColor(account.platform)}`}>
                  {getPlatformIcon(account.platform)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 capitalize">{account.platform}</h3>
                  <p className="text-sm text-gray-500">{account.username}</p>
                  {account.connectedAt && (
                    <p className="text-xs text-gray-400">Connected on {account.connectedAt}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {account.connected ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-green-600">Connected</span>
                    </div>
                    <button className="px-3 py-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors duration-200">
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
                    Connect Account
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <p className="text-gray-600">Configure how you want to be notified about your social media activity</p>
      
      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => {
          const labels: Record<string, string> = {
            postScheduled: 'Post Scheduled',
            postPublished: 'Post Published',
            accountConnected: 'Account Connected',
            weeklyReport: 'Weekly Report',
            monthlyReport: 'Monthly Report',
          };
          
          const descriptions: Record<string, string> = {
            postScheduled: 'Get notified when a post is successfully scheduled',
            postPublished: 'Get notified when a scheduled post is published',
            accountConnected: 'Get notified when a new social account is connected',
            weeklyReport: 'Receive weekly performance summaries',
            monthlyReport: 'Receive monthly analytics reports',
          };
          
          return (
            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{labels[key]}</h3>
                <p className="text-sm text-gray-500">{descriptions[key]}</p>
              </div>
              <button
                onClick={() => handleNotificationChange(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  value ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Key className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
          </div>
          <button className="w-full px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200">
            Change Password
          </button>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
          </div>
          <button className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200">
            Enable 2FA
          </button>
        </div>
      </div>
      
      <div className="p-6 border border-gray-200 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-4">Recent Security Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last login from Chrome on MacOS</span>
            <span className="text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Password changed</span>
            <span className="text-gray-500">3 days ago</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Twitter account connected</span>
            <span className="text-gray-500">1 week ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Default Posting Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Time Zone</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>UTC-8 (Pacific Time)</option>
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC+0 (Greenwich Mean Time)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Posting Time</label>
            <input
              type="time"
              defaultValue="10:00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Content Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">AI Writing Style</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>Professional</option>
              <option>Casual</option>
              <option>Creative</option>
              <option>Technical</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Hashtags</label>
            <input
              type="text"
              placeholder="#business #growth #innovation"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
          Save Preferences
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSettings();
      case 'accounts': return renderSocialAccounts();
      case 'notifications': return renderNotifications();
      case 'security': return renderSecurity();
      case 'preferences': return renderPreferences();
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};