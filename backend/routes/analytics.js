const router = require('express').Router();

router.get("/twitter/:tweetId", async (req, res) => {
  try {
    const { tweetId } = req.params;

    const response = await axios.get(
      `https://api.x.com/2/tweets/${tweetId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
        params: {
          "tweet.fields": "public_metrics,created_at",
        },
      }
    );

    const tweet = response.data.data;

    const analytics = {
      tweetId: tweet.id,
      impressions: tweet.public_metrics.impression_count,
      likes: tweet.public_metrics.like_count,
      retweets: tweet.public_metrics.retweet_count,
      replies: tweet.public_metrics.reply_count,
      quotes: tweet.public_metrics.quote_count,
      createdAt: tweet.created_at,
    };

    res.json({ success: true, analytics });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to fetch Twitter analytics" });
  }
});

router.get("/twitter", async (req, res) => {
  try {
    // Assume you store tweet IDs in DB
    const tweetIds = ["1842726129823735", "1842736129445723"]; 

    const response = await axios.get(
      "https://api.x.com/2/tweets",
      {
        headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
        params: {
          ids: tweetIds.join(","),
          "tweet.fields": "public_metrics,created_at",
        },
      }
    );

    const tweets = response.data.data;
    const analyticsList = tweets.map((t) => ({
      tweetId: t.id,
      impressions: t.public_metrics.impression_count,
      likes: t.public_metrics.like_count,
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
      }),
      { impressions: 0, likes: 0, retweets: 0, replies: 0, quotes: 0 }
    );

    res.json({ success: true, totals, posts: analyticsList });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to fetch Twitter analytics" });
  }
});

router.get("/linkedin/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const user = await User.findById(req.userId);

    if(!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const accessToken = user.socialAccounts.linkedin.accessToken;   

    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'LinkedIn account not connected' });
    }

    const response = await axios.get(
      `https://api.linkedin.com/rest/posts/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202404",
        },
        params: {
          projection: "(createdAt,statistics~(viewsCount,likesCount,commentsCount,sharesCount,clickCount))",
        },
      }
    );

    const data = response.data;
    const stats = data["statistics~"];

    const analytics = {
      postId,
      impressions: stats.viewsCount,
      likes: stats.likesCount,
      comments: stats.commentsCount,
      shares: stats.sharesCount,
      clicks: stats.clickCount,
      createdAt: data.createdAt,
    };

    res.json({ success: true, analytics });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to fetch LinkedIn analytics" });
  }
});

router.get("/linkedin", async (req, res) => {
  try {
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