const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

// Get all posts for user
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Create new post
router.post('/', async (req, res) => {
  try {
    const {
      content,
      platforms,
      scheduledFor,
      postType = 'dynamic',
      aiGenerated = false,
    } = req.body;
    
    if (!req.userId || !content.text) return res.status(400).send("userId and text required");
    
    const client = await getTwitterClient(userId);
    const tweet = await client.v2.tweet(content.text);

      const post = new Post({
        userId: req.userId,
        content,
        platforms,
        scheduledFor: new Date(scheduledFor),
        postType,
        aiGenerated,
        status: 'scheduled',
      });

      await post.save();
      res.status(201).json(post);
    } catch (error) {
      console.error(`Create post error:${platforms.includes('twitter') && "twitter"}`, error);
      res.status(500).json({ message: 'Error creating pos ' });
    }
});

// Update post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    Object.assign(post, req.body);
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Error updating post' });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.userId });
    
    const analytics = {
      totalPosts: posts.length,
      scheduledPosts: posts.filter(p => p.status === 'scheduled').length,
      publishedPosts: posts.filter(p => p.status === 'published').length,
      draftPosts: posts.filter(p => p.status === 'draft').length,
      totalEngagement: posts.reduce((sum, post) => {
        return sum + post.engagement.likes + post.engagement.shares + post.engagement.comments;
      }, 0),
      platformBreakdown: {
        twitter: posts.filter(p => p.platforms.includes('twitter')).length,
        linkedin: posts.filter(p => p.platforms.includes('linkedin')).length,
      },
    };

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

module.exports = router;