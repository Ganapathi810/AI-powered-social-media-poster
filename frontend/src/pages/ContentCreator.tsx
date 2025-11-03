import React, { useState } from 'react';
import { apiService } from '../services/api';
import {  
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'react-toastify';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export const ContentCreator: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI content assistant. Tell me about your business, target audience, and what kind of content you'd like to create today. The more details you share, the better I can tailor content for you!",
      timestamp: new Date()
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiContent, setAIContent] = useState(''); // single source of truth for generated content
  const [posting,setPosting] = useState<string | null>(null)
  const [copyChatMessage,setCopyChatMessage] = useState<number | null>(null)

  const platforms = ['twitter', 'linkedin'];

  // Send chat message
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await apiService.chatWithAI(inputMessage);

      const botMessage: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Generate/update AI content
      await generateAIContent(inputMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          id: messages.length + 2,
          type: 'bot',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Generate AI content
  const generateAIContent = async (prompt: string) => {
    try {
      const conversationContext = messages.slice(-5)
        .map(msg => `${msg.type}: ${msg.content}`)
        .join('\n');

      const enhancedPrompt = `Based on our conversation: "${conversationContext}"\n\nGenerate social media content for: ${prompt}`;

      const result = await apiService.generateContent(enhancedPrompt, 'text', platforms);

      const contentText = result.content.text || '';
      setAIContent(contentText); // updates right panel
    } catch (error) {
      console.error('Error generating AI content:', error);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy to clipboard');
    }
  };

  // Publish content to a single platform
  const publishContent = async (platform: string) => {
    if (!aiContent.trim()) return;

    try {
      setPosting(platform)

      const result = await apiService.publishPost(aiContent,platform);
      console.log("publish result",result)

      if(result) {
        toast.success(`Published the post successfully on ${platform}`);
      }
      
    } catch (error) {
      console.error(`Error posting to ${platform}:`, error);
      toast.error(`Error posting to ${platform}. Please try again.`);
    } finally {
      setPosting(null)
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Content Creator</h1>
        <p className="mt-2 text-gray-600">Chat with AI to generate personalized content for your social media</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-16rem)]">
        {/* Chat Interface */}
        <div className="bg-white rounded-xl shadow-sm border border-indigo-400/50 hover:shadow-indigo-200 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-2' : 'mr-2'}`}>
                    <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                      {message.type === 'user' ? <User className="h-4 w-4 text-indigo-600" /> : <Bot className="h-4 w-4 text-gray-600" />}
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <div className={`px-4 py-2 rounded-lg ${message.type === 'user' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className='flex justify-end mt-1'>
                        {copyChatMessage !== message.id ? (
                          <Copy 
                            className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer mt-1"
                            onClick={() => {
                              console.log("hi thre")
                              setCopyChatMessage(message.id)
                              copyToClipboard(message.content)
                              setTimeout(() => setCopyChatMessage(null) ,1000)
                            }}
                          />
                          ) : (
                          <Check 
                            className="h-4 w-4 text-green-400 hover:text-green-600 cursor-pointer mt-1"
                          />
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="flex-shrink-0 mr-2">
                    <div className="p-2 rounded-full bg-gray-100">
                      <Bot className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tell me about your business, audience, or content needs..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !inputMessage.trim()}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send className="h-5 w-5 rotate-45" />
            </button>
          </div>
        </div>

        {/* Generated Content Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-indigo-400/50 hover:shadow-indigo-200 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Post Content</h2>
            </div>
            <button
              onClick={() => setAIContent('')}
              className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Clear
            </button>
          </div>

          <textarea
            value={aiContent}
            onChange={(e) => setAIContent(e.target.value)}
            rows={8}
            className="w-full h-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none mb-4"
            placeholder="copy the content from chat or write on your own..."
          />

          <div className="flex space-x-2">
            {platforms.map(platform => (
              <button
                key={platform}
                onClick={() => publishContent(platform)}
                className="bg-green-600 text-white px-3 py-1 rounded-lg capitalize hover:bg-green-700"
              >
                {posting === platform ? "Posting..." : `Post to ${platform}`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


