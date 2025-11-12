import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  MessageCircle, 
  Share,
  Eye,
  ThumbsUpIcon,
  Repeat2,
  Reply,
  MessageSquareQuote,
  Bookmark,
  X,
  MousePointerClick,
} from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa6';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

type Post = {
  _id: string;
  platform: string;
  content: string;
  publishedAt: string;
  postId: string;
  analytics: {
    twitter: {
      impressions: number;
      likes: number;
      retweets: number;
      replies: number;
      quotes: number;
      bookmarks: number;
    },
    linkedin: {
      impressions: number;
      likes: number;
      comments: number;
      reposts: number;
      clicks: number;
    }
  };
};

type SocialAcccounts = {
  twitter?: {
    connected: boolean;
    id?: string | null | undefined;
    username?: string | null | undefined;
    accessToken?: string | null | undefined;
    refreshToken?: string | null | undefined;
    expiresAt?: number | null | undefined;
  },
  linkedin?: {
    connected: boolean;
    id?: string | null | undefined;
    username?: string | null | undefined;
    accessToken?: string | null | undefined;
    refreshToken?: string | null | undefined;
    expiresIn?: number | null | undefined;
  }
}


export const Analytics: React.FC = () => {
  const [selected,setSelected] = useState('twitter')
  const [postsOnTwitter,setPostsOnTwitter] = useState<Post[]>([])
  const [postsOnLinkedIn,setPostsOnLinkedIn] = useState<Post[]>([])
  const [loadingTwitterAnalytics,setLoadingTwitterAnalytics] = useState(false)
  const [loadingLinkedinAnalytics,setLoadingLinkedinAnalytics] = useState(false)
  const [loadingPosts,setLoadingPosts] = useState(false)
  const [socialAccounts,setSocialAccounts] = useState<SocialAcccounts>({}) 
  const [totalTwitterAnalytics,setTotalTwitterAnalytics] = useState({ 
    impressions: 0, 
    likes: 0, 
    retweets: 0, 
    replies: 0, 
    quotes: 0, 
    bookmarks: 0 
  })
  const [totalLinkedinAnalytics,setTotalLinkedinAnalytics] = useState({ 
    impressions: 0, 
    likes: 0, 
    comments: 0, 
    reposts: 0, 
    clicks: 0 
  })
  
  useEffect(() => {
      const getPostsFromBackend = async () => {
        try {
          setLoadingPosts(true)
          const posts = await apiService.getPosts()
          console.log(posts)
          const publishedOnTwitter: Post[] = posts.filter((post: any) => post.platform === "twitter")
          console.log("Published on Twitter: ",publishedOnTwitter)
          const publishedOnLinkedIn: Post[] = posts.filter((post: any) => post.platform === "linkedin")
          setPostsOnLinkedIn(publishedOnLinkedIn)
          setPostsOnTwitter(publishedOnTwitter)

        } catch (error) {
          console.error("Failed to fetch Post stats: ",error)
          toast.error('Error loading post statistics. Please try again later.');
        } finally {
          setLoadingPosts(false)
        }
      }
  
      getPostsFromBackend()
  },[])

  useEffect(() => {
    const fetchSocialAccounts = async () => {
      try {
        const accounts = await apiService.getSocialAccounts();
        setSocialAccounts(accounts);
        console.log("Fetched social accounts in analytics: ",accounts);
      } catch (error) {
        console.error("Error fetching social accounts in analytics: ",error);
        toast.error('Error fetching social accounts. Please try again later.');
      }
    }

    fetchSocialAccounts()
  },[])

  useEffect(() => {
    const fetchTwitterAnalytics = async () => {
      try {
        console.log('front end fetching analytics')
        setLoadingTwitterAnalytics(true)
        const analyticsData = await apiService.getAnalyticsByPlatform("twitter");
        setTotalTwitterAnalytics(analyticsData.totals)
        console.log("Fetched twitter analytics data: ",analyticsData);
      } catch (error) {
        
        console.error("Error fetching twitter analytics: ",error);
        toast.error('Error fetching twitter analytics data. Please try again later.');
      } finally {
        setLoadingTwitterAnalytics(false)
      } 
    }

    fetchTwitterAnalytics()
  },[])

  useEffect(() => {
    const fetchLinkedinAnalytics = async () => {
      try {
        setLoadingLinkedinAnalytics(true)
        const linkedinAnalyticsData = await apiService.getAnalyticsByPlatform("linkedin");
        setTotalLinkedinAnalytics(linkedinAnalyticsData.totals)
        console.log("Fetched linkedin analytics data: ",linkedinAnalyticsData);
      } catch (error) {
        
        console.error("Error fetching linked analytics: ",error);
        toast.error('Error fetching linkedin analytics data. Please try again later.');
      } finally {
        setLoadingLinkedinAnalytics(false)
      } 
    }
    
    fetchLinkedinAnalytics()
  },[])


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
      case 'twitter': return <X className="h-5 w-5" />;
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

  const getMetrics = (platform: string) => {
    if(platform === 'twitter'){
      return [
        { name: 'Impressions', value: totalTwitterAnalytics.impressions, icon: Eye },
        { name: 'Likes', value: totalTwitterAnalytics.likes, icon: ThumbsUpIcon },
        { name: 'Retweets', value: totalTwitterAnalytics.retweets, icon: Repeat2 },
        { name: 'Replies', value: totalTwitterAnalytics.replies, icon: Reply },
        { name: 'Quotes', value: totalTwitterAnalytics.quotes, icon: MessageSquareQuote },
        { name: 'Bookmarks', value: totalTwitterAnalytics.bookmarks, icon: Bookmark },
      ]
    } else if (platform === 'linkedin'){
      return [
        { name: 'Impressions', value: totalLinkedinAnalytics.impressions, icon: Eye },
        { name: 'Likes', value: totalLinkedinAnalytics.likes, icon: ThumbsUpIcon }, 
        { name: 'Comments', value: totalLinkedinAnalytics.comments, icon: MessageCircle },
        { name: 'Reposts', value: totalLinkedinAnalytics.reposts, icon: Repeat2 },
        { name: 'Clicks', value: totalLinkedinAnalytics.clicks, icon: MousePointerClick },
      ]
    }
    return []
  }

  const twitterAnalyticsIcons = {
    impressions: Eye,
    likes: ThumbsUpIcon,
    retweets: Repeat2,  
    replies: Reply,
    quotes: MessageSquareQuote,
    bookmarks: Bookmark
  }

  const linkedinAnalyticsIcons = {
    impressions: Eye,
    likes: ThumbsUpIcon,
    comments: MessageCircle,
    shares: Share,
    clicks: TrendingUp
  }


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
        {getMetrics(selected).map((metric) => {
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
                    {(selected === 'twitter' ? loadingTwitterAnalytics : loadingLinkedinAnalytics) ? (
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
          {loadingPosts ? (
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
                <a href={`https://x.com/${socialAccounts?.twitter?.username}/status/${post.postId}`} key={post._id} target='_blank' className="block hover:cursor-pointer">
                  <div key={post._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded ${getPlatformColor(post.platform)}`}>
                          {getPlatformIcon(post.platform)}
                        </div>
                        <span className="text-sm font-medium text-gray-700 capitalize">{post.platform}</span>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                    
                    <p className="text-gray-900 mb-4 line-clamp-2">{post.content}</p>
                    
                    <div className="flex items-center space-x-7 text-sm text-gray-600">
                      {Object.entries(selected === "twitter" ? post.analytics.twitter : post.analytics.linkedin).map(([key, value]) => {
                        const IconComponent = selected === "twitter" ? twitterAnalyticsIcons[key as keyof typeof twitterAnalyticsIcons] : linkedinAnalyticsIcons[key as keyof typeof linkedinAnalyticsIcons];
                        return (
                          <div key={key} className="flex items-center space-x-1">
                            <IconComponent className="h-4 w-4" />
                            <span className='text-gray-600'>{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </a>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};