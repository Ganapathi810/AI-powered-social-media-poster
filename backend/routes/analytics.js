const axios = require('axios');
const User = require('../models/User');
const { getTwitterClientAfterTokenRefresh } = require('../config/twitter');
const Post = require('../models/Post');

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
      bookmarks: t.public_metrics.bookmark_count,
      retweets: t.public_metrics.retweet_count,
      replies: t.public_metrics.reply_count,
      quotes: t.public_metrics.quote_count,
      createdAt: t.created_at,
    }));

    const updatePromises = analyticsList.map((a) =>
      Post.updateOne(
        { userId: req.userId, platform: "twitter", postId: a.tweetId },
        {
          $set: {
            "publishedAt": new Date(a.createdAt),
            "analytics.twitter.impressions": a.impressions,
            "analytics.twitter.likes": a.likes,
            "analytics.twitter.retweets": a.retweets,
            "analytics.twitter.replies": a.replies,
            "analytics.twitter.quotes": a.quotes,
            "analytics.twitter.bookmarks": a.bookmarks,
          },
        }
      )
    );

    await Promise.all(updatePromises);

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
    if(err?.response?.status === 429){
      message = "Rate limit exceeded for Twitter API";
    } else {
      message = "Failed to fetch Twitter analytics";
    }
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message });
  }
});

router.get("/linkedin", async (req, res) => {

  /* require business email to access the LinkedIn API Endpoints for post analytics,
    So for now returning default analytics 
  */

  const totals = { impressions: 0, likes: 0, comments: 0, clicks: 0, reposts: 0 }

  res.status(200).json({
    success: true,
    totals
  })

});


module.exports = router;