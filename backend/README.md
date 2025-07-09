
---

## ✅ Complete `backend/README.md`

```markdown
# StudySync Backend

This is the backend server for **StudySync**, a full-stack learning platform that lets users:

✅ Upload and manage study notes  
✅ Generate AI-powered summaries and tags  
✅ Create flashcards and quizzes from notes  
✅ Track progress and activity  
✅ Manage user authentication and profiles

Built with **Node.js**, **Express.js**, **MongoDB**, and Google **Gemini AI** for advanced content generation.

---

## 📂 Project Structure

```

backend/
├─ config/
│  └─ db.js
├─ controllers/
│  ├─ authController.js
│  ├─ dashboardController.js
│  ├─ flashcardController.js
│  ├─ noteController.js
│  ├─ profileController.js
│  ├─ progressController.js
│  └─ quizController.js
├─ middleware/
│  ├─ authMiddleware.js
│  └─ uploadMiddleware.js
├─ models/
│  ├─ activityLog.js
│  ├─ flashcard.js
│  ├─ note.js
│  ├─ quiz.js
│  └─ user.js
├─ routes/
│  ├─ authRoutes.js
│  ├─ dashboardRoutes.js
│  ├─ flashcardRoutes.js
│  ├─ noteRoutes.js
│  ├─ profileRoutes.js
│  ├─ progressRoutes.js
│  ├─ quizRoutes.js
│  └─ userRoutes.js
├─ utils/
│  ├─ activityUtil.js
│  ├─ documentUtils.js
│  ├─ questionGenerator.js
│  ├─ quoteUtils.js
│  ├─ summary.js
│  └─ tagGenerator.js
├─ .env
├─ package-lock.json
├─ package.json
├─ README.md
├─ server.js
└─ testGeminiModels.js

````

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/studysync.git
cd studysync/backend
````

---

### 2. Install Dependencies

Run:

```bash
npm install
```

---

### 3. Environment Variables

Create a `.env` file in the backend root with the following keys:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

---

### 4. Run the Server

Start the backend:

```bash
npm start
```

Server runs on:

```
http://localhost:5000
```

---

## 📦 Backend Dependencies

These are the key dependencies used in the backend:

| Package               | Purpose                                                 |
| --------------------- | ------------------------------------------------------- |
| express               | Web server and routing                                  |
| mongoose              | MongoDB ODM for models and schemas                      |
| bcryptjs              | Password hashing                                        |
| jsonwebtoken          | User authentication with JWTs                           |
| dotenv                | Environment variable management                         |
| multer                | Handling file uploads (documents, images)               |
| cors                  | Enable cross-origin requests from frontend              |
| @google/generative-ai | Access to Gemini AI for content and question generation |
| morgan (optional)     | HTTP request logging                                    |

Install them via:

```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv multer cors @google/generative-ai
```

---

## 🔗 API Overview

The backend exposes multiple API endpoints organized by resource:

| Route           | Description                                 |
| --------------- | ------------------------------------------- |
| /api/auth       | User registration, login, authentication    |
| /api/notes      | Upload, fetch, edit, and delete study notes |
| /api/flashcards | CRUD operations for flashcards              |
| /api/quizzes    | Generate quizzes, view, and attempt quizzes |
| /api/profile    | User profile updates and retrieval          |
| /api/dashboard  | Data for user dashboard and analytics       |
| /api/progress   | Tracking user progress and activity logs    |
| /api/users      | Admin-level user operations                 |

Refer to each `routes/*.js` file for the specific endpoints.

---

## 🤖 AI Integrations

This backend integrates with **Google Gemini AI** to:

* Generate summaries from uploaded notes
* Suggest tags for notes
* Create quiz questions dynamically

---

## 🧪 Gemini Testing

Test Gemini integrations with:

```bash
node testGeminiModels.js
```

This file sends test prompts to Gemini to validate the API key and model output.

---

## 📝 License

MIT License

---

## 👨‍💻 Contributing

Feel free to open issues or submit pull requests for improvements!

Happy coding!

```

Let me know if you’d like to **simplify it further, add examples of API requests, or customize the style** for your preferred audience!
```
