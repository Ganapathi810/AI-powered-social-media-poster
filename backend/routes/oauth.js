const express = require('express');
const { default: axios } = require('axios');
const querystring = require("querystring");
const User = require('../models/User');
const { twitterClient } = require('../config/twitter');
const TwitterOAuth = require("../models/TwitterOAuth");
const LinkedinOAuth = require('../models/LinkedinOAuth');

const router = express.Router();

// Twitter OAuth routes
router.get('/twitter', async (req, res) => {

  const userId = req.query.userId

  if (!userId) return res.status(400).send("User ID required");

  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
    process.env.TWITTER_CALLBACK_URL || "http://localhost:5000/api/social/auth/twitter/callback",
    {
      scope: ["tweet.read", "tweet.write", "users.read", "offline.access"],
    }
  );

  await TwitterOAuth.create({ userId, state, codeVerifier });

  return res.redirect(url);
});

router.get('/twitter/callback', 
  async (req, res) => {
    try {
      const { state, code } = req.query;
  
      const oauthRecord = await TwitterOAuth.findOne({ state });
      if (!oauthRecord) return res.status(400).send("Invalid or expired OAuth state");
  
      const {
        accessToken,
        refreshToken,
        expiresIn,
      } = await twitterClient.loginWithOAuth2({
        code: code,
        codeVerifier: oauthRecord.codeVerifier,
        redirectUri: process.env.TWITTER_CALLBACK_URL || "http://localhost:5000/api/social/auth/twitter/callback"
      });


      const user = await User.findById(oauthRecord.userId);
      if (!user) return res.status(404).send("User not found");
  
      user.socialAccounts.twitter = {
        connected: true,
        accessToken,
        refreshToken,
        expiresAt: Date.now() + expiresIn * 1000,
      };
      await user.save();
  
      // cleanup
      await TwitterOAuth.deleteOne({ _id: oauthRecord._id });
  
      return res.redirect(`${process.env.FRONTEND_URL}/oauth-success?platform=twitter`);
    } catch (err) {
      console.error("Twitter OAuth error:", err);
      res.redirect(`${process.env.FRONTEND_URL}/?error=twitter_connection_failed`);
    }
    }
);

// LinkedIn OAuth routes
router.get('/linkedin', async (req, res) => {
  const userId = req.query.userId 
  const scope = "openid profile email w_member_social r_member_social r_ads_reporting"
  const state = Math.random().toString(36).substring(2) + Date.now();

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    process.env.LINKEDIN_CALLBACK_URL || "http://localhost:5000/api/social/auth/linkedin/callback"
  )}&scope=${encodeURIComponent(scope)}&state=${state}`;

  await LinkedinOAuth.create({
    userId,
    state
  })


  res.redirect(authUrl);
});

router.get('/linkedin/callback',
  async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

  try {
    // Exchange code for access token
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.LINKEDIN_CALLBACK_URL || "http://localhost:5000/api/social/auth/linkedin/callback",
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKED_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenRes.data.access_token;
    const expiresIn = tokenRes.data.expires_in

    const user = await LinkedinOAuth.findOne({
      state
    })
    await User.updateOne(
      { _id: user.userId },
      { $set: { 
          "socialAccounts.linkedin.accessToken": accessToken, 
          "socialAccounts.linkedin.connected": true,
          "socialAccounts.linkedin.expiresIn": expiresIn
        } 
      }
    );

    return res.redirect(`${process.env.FRONTEND_URL}/oauth-success?platform=linkedin`);
  } catch (err) {
    console.error("Twitter OAuth error:", err);
      res.redirect(`${process.env.FRONTEND_URL}/?error=linkedin_connection_failed`);
  }
  }
);

module.exports = router;
