const express = require('express');

const User = require('../models/User');
const { TwitterApi } = require('twitter-api-v2');
const { refreshTwitterToken } = require('../config/twitter');
const { default: axios } = require('axios');
const Post = require('../models/Post');

const router = express.Router();

router.post('/connect/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const { accessToken, username } = req.body;

    if (!['twitter', 'linkedin'].includes(platform)) {
      return res.status(400).json({ message: 'Invalid platform' });
    }

    const user = await User.findById(req.userId);
    
    user.socialAccounts[platform] = {
      connected: true,
      username,
      accessToken,
    };

    await user.save();

    res.json({ message: `${platform} account connected successfully` });
  } catch (error) {
    console.error('Connect social account error:', error);
    res.status(500).json({ message: 'Error connecting social account' });
  }
});


router.post('/disconnect/:platform', async (req, res) => {
  try {
    const { platform } = req.params;

    if (!['twitter', 'linkedin'].includes(platform)) {
      return res.status(400).json({ message: 'Invalid platform' });
    }

    const user = await User.findById(req.userId);
    
    user.socialAccounts[platform] = {
      connected: false,
      username: '',
      accessToken: '',
      refreshToken: '',
    };

    await user.save();

    res.json({ message: `${platform} account disconnected successfully` });
  } catch (error) {
    console.error('Disconnect social account error:', error);
    res.status(500).json({ message: 'Error disconnecting social account' });
  }
});

router.get('/accounts', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('socialAccounts');
    res.json(user.socialAccounts);
  } catch (error) {
    console.error('Get social accounts error:', error);
    res.status(500).json({ message: 'Error fetching social accounts' });
  }
});

router.post('/twitter/publish', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Tweet content required" });

    const user = await User.findById(req.userId);
    if (!user || !user.socialAccounts?.twitter?.connected) {
      return res.status(400).json({ message: "Twitter account not connected" });
    }

    let client;
    const { accessToken, refreshToken, expiresAt } = user.socialAccounts.twitter;

    // if token expired → refresh
    if (!accessToken || Date.now() >= expiresAt) {
      console.log("Refreshing expired Twitter token...");
      client = await refreshTwitterToken(user);
    } else {
      client = new TwitterApi(accessToken);
    }


    const tweet = await client.v2.tweet(content);

    await Post.create({
      userId: req.userId,
      content,
      platform: 'twitter',
      postId: tweet.data.id,
      publishedAt: new Date(),
      analytics: {
        impressions: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        clicks: 0,
        engagementRate: 0,
      },
    });

    

    res.json({ message: "Tweet posted successfully", tweet });
  } catch (err) {
    console.error("Twitter post error:", err?.data || err);
    res.status(500).json({ error: err?.data || "Failed to post tweet" });
  }
})


router.post("/linkedin/publish", async (req, res) => {
  try {
    console.log("LinkedIn publish endpoint hit")
    const { content } = req.body; 
    if (!content) return res.status(400).json({ message: "Linkedin post content required" });

    const user = await User.findById(req.userId);
    if (!user || !user.socialAccounts?.twitter?.connected) {
      return res.status(400).json({ message: "Linkedin account not connected" });
    }

    const accessToken = user.socialAccounts.linkedin.accessToken;

    if (!accessToken) {
      return res.status(400).json({ message: 'LinkedIn account not connected' });
    }

    // Get LinkedIn user ID
    const profileRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const linkedInId = profileRes.data.sub;

    // Prepare post payload
    const postPayload = {
      author: `urn:li:person:${linkedInId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    console.log("before api call")

    // Post to LinkedIn
    const postRes = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      postPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('After api call')

    console.log('LinkedIn post response:', postRes);
    console.log("before saving to db")
    await Post.create({
      userId: req.userId,
      content,
      platform: 'linkedin',
      postId: postRes.data.id,
      publishedAt: new Date(),
      });
    console.log('afer saving to db')
    res.json({ message: 'Content posted to LinkedIn', postId: postRes.data.id });
  } catch (error) {
    console.error('LinkedIn post error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error posting to LinkedIn', error: error.message });
  }
})

// Get OAuth URLs for connecting accounts
router.get('/auth-urls', (req, res) => {
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  
  const authUrls = {
    twitter: `${baseUrl}/api/social/auth/twitter`,
    linkedin: `${baseUrl}/api/social/auth/linkedin`,
  };

  res.json(authUrls);
});

module.exports = router;