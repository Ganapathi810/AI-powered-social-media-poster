const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    text: String,
    caption: String,
    mediaUrl: String,
    mediaType: {
      type: String,
      enum: ['text', 'image', 'video'],
      default: 'text',
    },
  },
  platforms: [{
    type: String,
    enum: ['twitter', 'linkedin', 'instagram'],
  }],
  scheduledFor: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft',
  },
  postType: {
    type: String,
    enum: ['dynamic', 'static'],
    default: 'dynamic',
  },
  aiGenerated: {
    type: Boolean,
    default: false,
  },
  engagement: {
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
  },
  publishedAt: Date,
  publishedIds: {
    twitter: String,
    linkedin: String,
    instagram: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Post', postSchema);