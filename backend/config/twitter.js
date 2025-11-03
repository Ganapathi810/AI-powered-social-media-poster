const { TwitterApi } = require('twitter-api-v2');

// Initialize with OAuth2
const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID,
  clientSecret: process.env.TWITTER_CLIENT_SECRET,
});

// Refresh token flow
async function getTwitterClientAfterTokenRefresh(user) {
  
    const {
      client,
      accessToken,
      refreshToken,
      expiresIn,
    } = await twitterClient.refreshOAuth2Token(user.socialAccounts.twitter.refreshToken);
  
    // update user DB
    user.socialAccounts.twitter.accessToken = accessToken;
    user.socialAccounts.twitter.refreshToken = refreshToken;
    user.socialAccounts.twitter.expiresAt = Date.now() + expiresIn * 1000;
    await user.save();
  
    return client;
  }

  module.exports = {
    getTwitterClientAfterTokenRefresh,
    twitterClient
  }
