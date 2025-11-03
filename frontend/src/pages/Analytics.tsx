import React, { useEffect, useMemo, useState } from 'react';
import { 
  TrendingUp, 
  MessageCircle, 
  Share,
  Eye,
  ThumbsUpIcon,
  EyeIcon,
} from 'lucide-react';
import { FaLinkedinIn, FaTwitter } from 'react-icons/fa6';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

type Post = {
  _id: string;
  platform: string;
  content: string;
  analytics: {
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
  };
};


export const Analytics: React.FC = () => {
  const [selected,setSelected] = useState('twitter')
  const [postsOnTwitter,setPostsOnTwitter] = useState<Post[]>([])
  const [postsOnLinkedIn,setPostsOnLinkedIn] = useState<Post[]>([])
  const [loading,setLoading] = useState(false)
  
  useEffect(() => {
      const getPostsFromBackend = async () => {
        try {
          setLoading(true)
          const posts = await apiService.getPosts()
          console.log(posts)
          const publishedOnTwitter = posts.filter((post: any) => post.platform === "twitter")
          const publishedOnLinkedIn = posts.filter((post: any) => post.platform === "linkedin")
          setPostsOnLinkedIn(publishedOnLinkedIn)
          setPostsOnTwitter(publishedOnTwitter)

        } catch (error) {
          console.error("Failed to fetch Post stats: ",error)
          toast.error('Error loading post statistics. Please try again later.');
        } finally {
          setLoading(false)
        }
      }
  
      getPostsFromBackend()
  },[])

  const platformAnalytics = useMemo(() => {
    const twitterTotals = postsOnTwitter.reduce(
      (total, post) => {
        total.impressions += post.analytics.impressions || 0;
        total.likes += post.analytics.likes || 0;
        total.comments += post.analytics.comments || 0;
        total.shares += post.analytics.shares || 0;
        total.clicks += post.analytics.clicks || 0;
        return total;
      },
      { impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0 }
    );

    const linkedInTotals = postsOnLinkedIn.reduce(
      (total, post) => {
        total.impressions += post.analytics.impressions || 0;
        total.likes += post.analytics.likes || 0;
        total.comments += post.analytics.comments || 0;
        total.shares += post.analytics.shares || 0;
        total.clicks += post.analytics.clicks || 0;
        return total;
      },
      { impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0 }
    );

    return {
      twitter: twitterTotals,
      linkedin: linkedInTotals,
    };
  }, [postsOnTwitter, postsOnLinkedIn]);

  const getMetrics = (platform: string) => {
    if(platform === 'twitter'){
      return platformAnalytics.twitter
    } else if (platform === 'linkedin'){
      return platformAnalytics.linkedin
    }
    return {
      impressions: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      clicks: 0
    }
  }

    
    
  const getPosts = (platform: string): Post[] => {
    if(platform === 'twitter'){
      return postsOnTwitter
    } else if (platform === 'linkedin'){
      return postsOnLinkedIn
    }
    return []
  }


  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <FaTwitter className="h-5 w-5" />;
      case 'linkedin': return <FaLinkedinIn className="h-5 w-5" />;
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

  const metrics = [
    {
      name: 'Impressions',
      value: getMetrics(selected).impressions,
      icon: Eye,
    },
    {
      name: 'Likes',
      value: getMetrics(selected).likes,
      icon: ThumbsUpIcon,
    },
    {
      name: 'Comments',
      value: getMetrics(selected).comments,
      icon: MessageCircle,
    },
    {
      name: 'Shares', 
      value: getMetrics(selected).shares,
      icon: Share,
    },
    {
      name: 'Clicks',
      value: getMetrics(selected).clicks,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">Track your social media performance and engagement</p>
      </div>

      <div className='relative flex gap-1'>
        <button
          className={`px-4 py-2 rounded-lg font-medium ${selected === 'twitter' ? 'text-indigo-600' : 'text-gray-700 hover:text-gray-500'}`}
          onClick={() => setSelected('twitter')}
        >X (Twitter)
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium ${selected === 'linkedin' ? 'text-indigo-600' : 'text-gray-700 hover:text-gray-500'}`}
          onClick={() => setSelected('linkedin')}
        >LinkedIn
        </button>

        <div className={`absolute ${selected === 'twitter' ? 'left-3' : 'left-28'} -bottom-2 w-[80px] bg-indigo-500 h-[2.5px] transition-all duration-200 ease-in-out`} />

      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-7">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="bg-white rounded-xl shadow-sm border border-indigo-400/50 hover:shadow-indigo-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                  <div className="flex items-center space-x-2">
                    {loading ? (
                      <div className="h-6 mt-2 w-9 bg-indigo-200 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>


      <div className="bg-white rounded-xl shadow-sm border border-indigo-400/50 hover:shadow-indigo-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Posts</h2>
        <div className="space-y-4">
          {loading ? (
            <div className='w-full animate-pulse bg-blue-100/50 p-4 rounded'>
              <div className='flex gap-2 items-center'>
                <span className='size-8 bg-indigo-200 rounded'></span>
                <span className='h-7 w-10 bg-indigo-200 rounded'></span>
              </div>
              <p className='bg-indigo-200 h-3 rounded w-90 mt-2'></p>
              <div className='flex gap-2 mt-3'>
                <span className='h-6 w-8 rounded bg-indigo-200'></span>
                <span className='h-6 w-8 rounded bg-indigo-200'></span>
                <span className='h-6 w-8 rounded bg-indigo-200'></span>
              </div>
            </div>
          ) : (getPosts(selected)?.length === 0) ? (
            <p className="text-gray-600">No posts available for {selected}.</p>
          ) : (
            <>
              {getPosts(selected)?.map((post) => (
                <div key={post._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded ${getPlatformColor(post.platform)}`}>
                        {getPlatformIcon(post.platform)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 capitalize">{post.platform}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-900 mb-4 line-clamp-2">{post.content}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <EyeIcon className="h-4 w-4" />
                      {loading ? (
                        <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div> 
                      ) : (
                        <span>{post.analytics.likes}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUpIcon className="h-4 w-4" />
                      <span>{post.analytics.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.analytics.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};