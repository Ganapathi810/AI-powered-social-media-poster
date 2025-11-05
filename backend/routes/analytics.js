const axios = require('axios');
const User = require('../models/User');
const { getTwitterClientAfterTokenRefresh } = require('../config/twitter');

const router = require('express').Router();

router.get("/twitter", async (req, res) => {
  console.log('inside twitter analytics route');
  try {
    const user = await User.findById(req.userId);

    if(!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const { accessToken, expiresAt } = user.socialAccounts.twitter; 

    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'Twitter account not connected' });
    }

    if (Date.now() >= expiresAt) {
      console.log('Access token expired, refreshing...');
      const twitterClient = await getTwitterClientAfterTokenRefresh(user);
      accessToken = twitterClient.accessToken;
    }

    console.log('Using access token: after refresh', accessToken);

    const twitterId = user.socialAccounts.twitter.id;

    const response = await axios.get(
      `https://api.x.com/2/users/${twitterId}/tweets`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          "tweet.fields": "public_metrics,created_at"
        },
      }
    );

    const tweets = response.data.data;

    const analyticsList = tweets.map((t) => ({
      tweetId: t.id,
      impressions: t.public_metrics.impression_count,
      likes: t.public_metrics.like_count,
      bookmarsks: t.public_metrics.bookmark_count,
      retweets: t.public_metrics.retweet_count,
      replies: t.public_metrics.reply_count,
      quotes: t.public_metrics.quote_count,
      createdAt: t.created_at,
    }));

    // Combine totals
    const totals = analyticsList.reduce(
      (acc, curr) => ({
        impressions: acc.impressions + curr.impressions,
        likes: acc.likes + curr.likes,
        retweets: acc.retweets + curr.retweets,
        replies: acc.replies + curr.replies,
        quotes: acc.quotes + curr.quotes,
        bookmarks: acc.bookmarks + curr.bookmarks,
      }),
      { impressions: 0, likes: 0, retweets: 0, replies: 0, quotes: 0, bookmarks: 0 }
    );

    res.json({ success: true, totals, tweets: analyticsList });

  } catch (err) {
    let message;
    if(err.response.status === 429){
      message = "Rate limit exceeded for Twitter API";
    } else {
      message = "Failed to fetch Twitter analytics";
    }
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message });
  }
});

router.get("/linkedin/:postId", async (req, res) => {
  try {
    
    return
    
    const { postId } = req.params;


    const user = await User.findById(req.userId);

    if(!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const accessToken = user.socialAccounts.linkedin.accessToken;   

    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'LinkedIn account not connected' });
    }

    const postResponse = await axios.get(
      `https://api.linkedin.com/rest/posts/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202510",
        },
      }
    );

    console.log("Post Response:", postResponse.data);

    // 2️⃣ Fetch analytics separately
    const statsResponse = await axios.get(
      `https://api.linkedin.com/rest/statistics`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202510",
        },
        params: {
          q: "entity",
          entity: postId, // e.g., urn:li:share:123456789
        },
      }
    );
    console.log("Stats Response:", statsResponse.data);

    const post = postResponse.data;
    const stats = statsResponse.data.elements?.[0]?.totalShareStatistics || {};

    const analytics = {
      postId,
      impressions: stats.impressionCount || 0,
      likes: stats.likeCount || 0,
      comments: stats.commentCount || 0,
      shares: stats.shareCount || 0,
      clicks: stats.clickCount || 0,
      createdAt: post.createdAt || null,
    };

    res.json({ success: true, analytics });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to fetch LinkedIn analytics" });
  }
});

router.get("/linkedin", async (req, res) => {
  try {

    return;
    const postIds = ["urn:li:share:72384823849234", "urn:li:share:72384823923948"];

    const analyticsList = [];

    for (const postId of postIds) {
      const response = await axios.get(
        `https://api.linkedin.com/rest/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
            "LinkedIn-Version": "202404",
          },
          params: {
            projection: "(statistics~(viewsCount,likesCount,commentsCount,sharesCount,clickCount))",
          },
        }
      );

      const stats = response.data["statistics~"];
      analyticsList.push({
        postId,
        impressions: stats.viewsCount,
        likes: stats.likesCount,
        comments: stats.commentsCount,
        shares: stats.sharesCount,
        clicks: stats.clickCount,
      });
    }

    // Combine totals
    const totals = analyticsList.reduce(
      (acc, curr) => ({
        impressions: acc.impressions + curr.impressions,
        likes: acc.likes + curr.likes,
        comments: acc.comments + curr.comments,
        shares: acc.shares + curr.shares,
        clicks: acc.clicks + curr.clicks,
      }),
      { impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0 }
    );

    res.json({ success: true, totals, posts: analyticsList });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to fetch LinkedIn analytics" });
  }
});

module.exports = router;