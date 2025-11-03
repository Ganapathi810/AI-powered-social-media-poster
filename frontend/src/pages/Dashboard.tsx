import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  CheckCircle,
  ExternalLink,
  X,
} from 'lucide-react';
import { FaLinkedin, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

interface PostStats {
  total: number;
  totalPublishedOnLinkedin: number;
  totalPublishedOnTwitter: number;
}

interface SocialAccount {
  platform: 'twitter' | 'linkedin'
  username: string;
  connected: boolean;
  followers: number;
}

export const Dashboard: React.FC = () => {
  const [postStats,setPostStats] = useState<PostStats>({
    total: 0,
    totalPublishedOnTwitter: 0,
    totalPublishedOnLinkedin: 0,
  });

  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    { platform: 'twitter', username: '', connected: false, followers: 0 },
    { platform: 'linkedin', username: '', connected: false, followers: 0 },
  ]);

  const [authUrls, setAuthUrls] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    loadSocialAccounts();
    loadAuthUrls();
  }, []);

  useEffect(() => {
    const getPostsFromBackend = async () => {
      try {
        const posts = await apiService.getPosts()

        const publishedOnTwitter = posts.filter((post: any) => post.platform === "twitter")

        setPostStats({
          total: posts.length,
          totalPublishedOnTwitter: publishedOnTwitter.length,
          totalPublishedOnLinkedin: posts.length - publishedOnTwitter.length
        })
      } catch (error) {
        console.error("Failed to fetch Post stats: ",error)
        toast.error('Error loading post statistics. Please try again later.');
      }
    }

    getPostsFromBackend()
  },[])

  useEffect(() => {
    const getRecentPosts = async () => {
      try {
        setLoadingPosts(true)
        const recentPosts = await apiService.getPostByFilter();
        setRecentPosts(recentPosts);
      } catch (error) {
        console.error("Failed to fetch recent posts: ",error)
        toast.error('Error loading recent posts. Please try again later.');
      } finally {
        setLoadingPosts(false);
      }
    }
    getRecentPosts()
  },[])

  const loadSocialAccounts = async () => {
    try {
      setLoading(true);
      const accounts = await apiService.getSocialAccounts();
      setSocialAccounts([
        { 
          platform: 'twitter', 
          username: accounts.twitter?.username || '', 
          connected: accounts.twitter?.connected || false, 
          followers: 0 
        },
        { 
          platform: 'linkedin', 
          username: accounts.linkedin?.username || '', 
          connected: accounts.linkedin?.connected || false, 
          followers: 0 
        },
      ]);
    } catch (error) {
      console.error('Error loading social accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAuthUrls = async () => {
    try {
      const urls = await apiService.getAuthUrls();
      console.log('Loaded auth URLs:', urls);
      setAuthUrls(urls);
    } catch (error) {
      console.error('Error loading auth URLs:', error);
      // Set fallback URLs for testing
      setAuthUrls({
        twitter: 'http://localhost:5000/api/social/auth/twitter',
        linkedin: 'http://localhost:5000/api/social/auth/linkedin',
      });
    }
  };

  const handleConnectAccount = async (platform: string) => {
    try {
      setConnecting(platform);
  
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first");
        setConnecting(null);
        return;
      }
  
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId;
  
      const authUrl = authUrls[platform];
      if (!authUrl) {
        toast.error("OAuth URL not available. Please try again later.");
        setConnecting(null);
        return;
      }
  
      const urlWithUserId = `${authUrl}?userId=${userId}`;
      const popup = window.open(urlWithUserId, "_blank", "width=600,height=600");
  
      if (!popup) {
        toast.error("Popup blocked. Please allow popups for this site.");
        setConnecting(null);
        return;
      }

      const popupCheckInterval = setInterval(() => {
        if (popup.closed) {
          console.log(`${platform} OAuth popup was closed by user`);
          setConnecting(null);
          clearInterval(popupCheckInterval);
          window.removeEventListener("message", handler);
        }
      }, 500);
  
      // Listen for OAuth success
      const handler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return; // security check
        if (event.data.type === "OAUTH_SUCCESS" && event.data.platform === platform) {
          console.log(`${platform} connected successfully`);
          clearInterval(popupCheckInterval);
          loadSocialAccounts(); // refresh
          setConnecting(null);
          window.removeEventListener("message", handler);
        }
      };
  
      window.addEventListener("message", handler);

      return () => {
        clearInterval(popupCheckInterval);
        window.removeEventListener("message", handler);
      };
    } catch (error) {
      console.error("Error connecting account:", error);
      toast.error("Error connecting account. Please try again.");
      setConnecting(null);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <FaXTwitter className="h-5 w-5" />;
      case 'linkedin': return <FaLinkedin className="h-5 w-5" />;
      default: return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'text-blue-500 bg-blue-50';
      case 'linkedin': return 'text-blue-700 bg-blue-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your social media presence with AI-powered tools</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/create"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Content
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-indigo-400/50 p-6 hover:shadow-md hover:shadow-indigo-200 transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total posts published</p>
              {loading ? (
                <div className="h-6 mt-2 w-9 bg-indigo-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{postStats.total}</p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-indigo-400/50 p-6 hover:shadow-md hover:shadow-indigo-200 transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <X className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total published on X (formerly Twitter)</p>
              {loading ? (
                <div className="h-6 mt-2 w-9 bg-indigo-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{postStats.totalPublishedOnTwitter}</p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-indigo-400/50 p-6 hover:shadow-md hover:shadow-indigo-200 transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaLinkedinIn className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total publised on LinkedIN</p>
              {loading ? (
                <div className="h-6 mt-2 w-9 bg-indigo-200 rounded animate-pulse"></div>
              ) : (
              <p className="text-2xl font-bold text-gray-900">{postStats.totalPublishedOnLinkedin}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Connected Accounts */}
        <div className="bg-white rounded-xl h-80 shadow-sm border border-indigo-400/50 hover:shadow-indigo-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Connected Accounts</h2>
          <div className="space-y-4">
            {socialAccounts.map((account) => (
              <div key={account.platform} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getPlatformColor(account.platform)}`}>
                    {getPlatformIcon(account.platform)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{account.platform}</p>
                    <p className="text-sm text-gray-500">
                      {loading ? (
                        <span className="h-3 w-20 bg-indigo-200 rounded animate-pulse inline-block mt-1"></span>
                      ) : account.connected ? (
                        <>Connected</>
                      ) : (
                        <>Not connected</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                    {loading ? (
                      <div className="h-8 w-34 bg-indigo-200 rounded animate-pulse"></div>
                    ) : (
                      <button 
                        onClick={async () => {
                          if(account.connected) {
                            setDisconnecting(account.platform)
                            try {
                              await apiService.disconnectSocialAccount(account.platform)
                              loadSocialAccounts();
                            } catch(error) {
                              console.error("Failed to disconnect:",error)
                              toast.error("Error disconnecting account. Please try again.");
                            } finally {
                              setDisconnecting(null)
                            }
                          }
                          else
                            handleConnectAccount(account.platform)
                        }}
                        className={`${account.connected ? "bg-red-500/50 hover:bg-red-500/90  active:bg-red-900" : "bg-white hover:bg-black/10 active:bg-black/20"} inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 transition-colors duration-200 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                        disabled={loading || connecting === account.platform}
                      >
                        {!account.connected ? (
                          <>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          {connecting === account.platform ? 'Connecting...' : `Connect ${account.platform}`}
                          </>
                        ): (
                          <>
                            {disconnecting === account.platform ? 'Disconnecting...' : account.connected ? "Disconnect" : `Disconnect ${account.platform}`}
                          </>
                        )}
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-xl h-80  shadow-sm border border-indigo-400/50 hover:shadow-indigo-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
            <Link
              to="/analytics"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors duration-200"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4 h-10/12 overflow-y-auto">
            {loadingPosts ? (
              <div className='space-y-4'>
                <div className='w-full animate-pulse bg-blue-100/50 p-5 rounded'>
                    <div className='size-8 bg-indigo-200 rounded'></div>
                    <div className='w-90 h-3 rounded bg-indigo-200 mt-2'></div>
                </div>
                <div className='w-full animate-pulse bg-blue-100/50 p-5 rounded'>
                    <div className='size-8 bg-indigo-200 rounded'></div>
                    <div className='w-90 h-3 rounded bg-indigo-200 mt-2'></div>
                </div>
              </div>
            ) : recentPosts.length > 0 ? (
              <>
                {recentPosts.map((post) => (
                  <div key={post._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded ${getPlatformColor(post.platform)}`}>
                          {getPlatformIcon(post.platform)}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 mb-3">{post.content}</p>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">Start creating amazing content with AI assistance</p>
                <Link
                  to="/create"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};