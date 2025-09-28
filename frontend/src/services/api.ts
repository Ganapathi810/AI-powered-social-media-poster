const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url =  API_BASE_URL ? `${API_BASE_URL}/api/${endpoint}` : `http://localhost:5000/api'${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Auth methods
  async register(userData: { email: string; password: string; firstName: string; lastName: string }) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('token', data.token);
    }
    
    return data;
  }

  async login(credentials: { email: string; password: string }) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('token', data.token);
    }
    
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // AI methods
  async chatWithAI(message: string) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async generateContent(prompt: string, contentType: string = 'text', platforms: string[] = ['twitter']) {
    return this.request('/ai/generate-content', {
      method: 'POST',
      body: JSON.stringify({ prompt, contentType, platforms }),
    });
  }

  async getConversation() {
    return this.request('/ai/conversation');
  }

  // Posts methods
  async getPosts() {
    return this.request('/posts');
  }

  async createPost(postData: any) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(postId: string, postData: any) {
    return this.request(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(postId: string) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  async getCalendarPosts(startDate: string, endDate: string) {
    return this.request(`/posts/calendar?startDate=${startDate}&endDate=${endDate}`);
  }

  async getAnalytics() {
    return this.request('/posts/analytics');
  }

  // Social accounts methods
  async getSocialAccounts() {
    return this.request('/social/accounts');
  }

  async getAuthUrls() {
    return this.request('/social/auth-urls');
  }

  async connectSocialAccount(platform: string, data: { accessToken: string; username: string }) {
    return this.request(`/social/connect/${platform}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async disconnectSocialAccount(platform: string) {
    return this.request(`/social/disconnect/${platform}`, {
      method: 'POST',
    });
  }

  async publishPost(content: string,platform: string) {
    return this.request(`/social/${platform}/publish`, {
      method: 'POST',
      body: JSON.stringify({
        content
      })
    });
  }
}

export const apiService = new ApiService();