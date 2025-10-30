const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  platform: { 
    type: String, 
    enum: ['twitter', 'linkedin'], 
    required: true 
  },
  analytics: {
    impressions: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }, 
    engagementRate: { type: Number, default: 0 }, 
  },
  publishedAt: {
    type: Date,
    required: true,
  },
  postId: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Post', postSchema);