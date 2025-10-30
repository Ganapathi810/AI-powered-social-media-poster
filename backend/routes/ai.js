const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const User = require('../models/User');
const Conversation = require('../models/Conversation');

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat with AI
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    // Get or create conversation
    let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      conversation = new Conversation({
        userId,
        messages: [{
          type: 'bot',
          content: "Hi! I'm your AI content assistant. Tell me about your business, target audience, and what kind of content you'd like to create today. The more details you share, the better I can tailor content for you!",
        }],
      });
    }

    // Add user message
    conversation.messages.push({
      type: 'user',
      content: message,
    });

    // Get user context
    const user = await User.findById(userId);
    
    // Build context for AI
    const contextPrompt = buildContextPrompt(user, conversation, message);
    
    // Generate AI response
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(contextPrompt);
    const aiResponse = result.response.text();

    // Add AI response
    conversation.messages.push({
      type: 'bot',
      content: aiResponse,
    });

    // Update business context if relevant information is provided
    updateBusinessContext(conversation, message);

    // Save conversation
    conversation.lastActive = new Date();
    await conversation.save();

    res.json({
      response: aiResponse,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Error generating AI response',
      error: error.message 
    });
  }
});

// Generate content
router.post('/generate-content', async (req, res) => {
  try {
    const { prompt, contentType = 'text', platforms = ['twitter'] } = req.body;
    const userId = req.userId;

    // Get user and conversation context
    const user = await User.findById(userId);
    const conversation = await Conversation.findOne({ userId });

    // Build content generation prompt
    const contentPrompt = buildContentGenerationPrompt(user, conversation, prompt, contentType, platforms);

    // Generate content with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(contentPrompt);
    const generatedContent = result.response.text();

    // Parse and format the generated content
    const formattedContent = parseGeneratedContent(generatedContent, contentType);

    res.json({
      content: formattedContent,
      type: contentType,
      platforms,
    });
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({ message: 'Error generating content' });
  }
});

// Get conversation history
router.get('/conversation', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ userId: req.userId });
    res.json(conversation || { messages: [] });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Error fetching conversation' });
  }
});

function buildContextPrompt(user, conversation, message) {
  const businessContext = conversation.businessContext || {};
  const recentMessages = conversation.messages.slice(-10); // Last 10 messages for context
  
  return `You are an AI social media content assistant. Here's the context:

Business Information:
- Industry: ${businessContext.industry || 'Not specified'}
- Target Audience: ${businessContext.targetAudience || 'Not specified'}
- Brand Voice: ${businessContext.brandVoice || 'Professional'}
- Goals: ${businessContext.goals?.join(', ') || 'Not specified'}

Recent conversation:
${recentMessages.map(msg => `${msg.type}: ${msg.content}`).join('\n')}

Current user message: ${message}

Please respond as a helpful social media assistant. Your role is to:
1. Have natural conversations about their business and social media needs
2. When appropriate, suggest creating specific social media content
3. Ask follow-up questions to understand their content needs better
4. Offer to generate posts, tweets, LinkedIn posts, etc.
5. Be conversational and helpful, not robotic

If the user mentions wanting to create content, posting on social media, or if you think they would benefit from specific content suggestions, mention that you can generate social media content for them.`;
}

function buildContentGenerationPrompt(user, conversation, prompt, contentType, platforms) {
  const businessContext = conversation?.businessContext || {};
  
  const platformGuidelines = {
    twitter: 'Twitter: Keep it under 280 characters, use relevant hashtags, make it engaging',
    linkedin: 'LinkedIn: Professional tone, can be longer, focus on business value and insights',
  };

  const guidelines = platforms.map(p => platformGuidelines[p]).join('\n');

  return `Create ${contentType} social media content based on this request: "${prompt}"

Business Context:
- Industry: ${businessContext.industry || 'General business'}
- Target Audience: ${businessContext.targetAudience || 'General audience'}
- Brand Voice: ${businessContext.brandVoice || 'Professional'}
- Goals: ${businessContext.goals?.join(', ') || 'Engagement and growth'}

Platform Guidelines:
${guidelines}

Requirements:
- Make it sound natural and human, not AI-generated
- Include relevant hashtags where appropriate
- Make it engaging and valuable to the target audience
- ${contentType === 'image' ? 'Provide both image description and caption' : ''}
- ${contentType === 'video' ? 'Provide both video concept and caption' : ''}

Generate compelling content that follows these guidelines.`;
}

function parseGeneratedContent(content, contentType) {
  if (contentType === 'image') {
    // Try to separate image description and caption
    const parts = content.split('\n\n');
    if (parts.length >= 2) {
      return {
        imageDescription: parts[0],
        caption: parts.slice(1).join('\n\n'),
      };
    }
  } else if (contentType === 'video') {
    // Try to separate video concept and caption
    const parts = content.split('\n\n');
    if (parts.length >= 2) {
      return {
        videoDescription: parts[0],
        caption: parts.slice(1).join('\n\n'),
      };
    }
  }
  
  return { text: content };
}

function updateBusinessContext(conversation, message) {
  const lowerMessage = message.toLowerCase();
  
  // Extract business information from user messages
  if (lowerMessage.includes('industry') || lowerMessage.includes('business')) {
    // Logic to extract and update industry information
  }
  
  if (lowerMessage.includes('audience') || lowerMessage.includes('target')) {
    // Logic to extract and update target audience information
  }
  
  // This could be expanded with more sophisticated NLP
}

module.exports = router;