<h1>
  <img src="./frontend/public/favicon.jpeg" alt="Tech Vibe Logo" width="67" style="margin-right: 10px;">
  Social AI
</h1>

It is an AI-powered social media management platform that allows users to effortlessly manage and publish content across their social accounts such as **LinkedIn** and **Twitter (X)** without leaving the app. It integrates AI-generated post creation, secure account connections, and performance analytics into a single, seamless dashboard.

&#x20;
 

---

## 🔥 Features

* 🤖 **AI-Powered Post Generation** — Create engaging posts using the **Gemini API**-powered AI chat interface.
* 🔐 **JWT-Based Secure Authentication** — Users are securely authenticated using **JSON Web Tokens (JWT)**.
* 🔗 **Social Account Integration** — Connect social accounts through **OAuth 2.0** for LinkedIn and Twitter.
* 🚀 **One-Click Publishing** — Instantly publish posts to connected accounts directly from the dashboard.
* 📊 **Post Analytics Dashboard** — View aggregated and individual analytics for your Twitter posts.
* 🌐 **Centralized Management** — Manage multiple accounts and posts from one intuitive interface.
* 📱 **Responsive UI** — Optimized for both desktop and mobile use.

---

## 🛠 Tech Stack

* **Frontend:** React.js + Tailwind CSS
* **Backend:** Node.js + Express.js
* **Database:** MongoDB
* **AI:** Gemini API (for content generation)
* **Auth:** JWT + OAuth 2.0 (LinkedIn, Twitter)
* **Deployment:** Vercel (Frontend), Render (Backend)

---

## 🗂 Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Ganapathi810/social-ai.git
   cd social-ai
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## ⚙️ Environment Variables

You’ll need **two separate `.env` files** for your project:

### 🔐 `frontend/.env`

```env
VITE_BACKEND_URL='your-backend-api-url'           # Backend API base URL
VITE_GEMINI_API_KEY='your-gemini-api-key'         # Gemini API key for AI-generated content
```

### 🔐 `backend/.env`

```env
MONGO_URL='your-mongodb-uri'                      # MongoDB connection string
PORT=5000                                         # Server port
JWT_SECRET='your-jwt-secret-key'                  # Secret for JWT signing

# OAuth Credentials
TWITTER_CLIENT_ID='your-twitter-client-id'
TWITTER_CLIENT_SECRET='your-twitter-client-secret'
LINKEDIN_CLIENT_ID='your-linkedin-client-id'
LINKEDIN_CLIENT_SECRET='your-linkedin-client-secret'

# Gemini API
GEMINI_API_KEY='your-gemini-api-key'
```

---

## 📡 API Endpoints

### 👤 `/api/auth`

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | /api/auth/register | Register a new user     |
| POST   | /api/auth/login    | Login and get JWT token |

---

### 🔗 `/api/social`

| Method | Endpoint                     | Description                        |
| ------ | ---------------------------- | ---------------------------------- |
| GET    | /api/social/connect/twitter  | Connect Twitter account via OAuth  |
| GET    | /api/social/connect/linkedin | Connect LinkedIn account via OAuth |
| POST   | /api/social/post/twitter     | Publish post to Twitter            |
| POST   | /api/social/post/linkedin    | Publish post to LinkedIn           |

> 🔐 Requires user authentication using JWT token

---

### 🤖 `/api/ai`

| Method | Endpoint         | Description                            |
| ------ | ---------------- | -------------------------------------- |
| POST   | /api/ai/generate | Generate post content using Gemini API |

---

### 📊 `/api/analytics`

| Method | Endpoint                       | Description                             |
| ------ | ------------------------------ | --------------------------------------- |
| GET    | /api/analytics/twitter         | Fetch aggregated analytics from Twitter |
| GET    | /api/analytics/twitter/:postId | Fetch analytics for a specific post     |

---

## 💡 Future Improvements

* 🗓 Schedule posts for future publishing
* 📈 Add LinkedIn analytics support
* 💬 Include AI-based comment/reply generation
* 🖼️ Support for media uploads with AI captions

---

## 📸 Preview

> *(Add screenshots or demo GIFs of your dashboard, AI post generator, and analytics here)*

---

Made with 💙 by **Ganapathi Othoju**
