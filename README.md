


---
# Title: "StudySync – AI-powered Study Platform"
# Description: "Full-stack platform using Node.js, MongoDB, React, and Gemini AI"
# 📚 StudySync – AI-powered Study Platform
---
**StudySync** is a full-stack learning productivity platform that allows users to:

✅ Upload and manage study notes  
✅ Generate AI-powered summaries and tags  
✅ Create flashcards and quizzes from notes  
✅ Track study progress and activity  
✅ Manage user authentication and profiles  

> Powered by **Node.js**, **Express**, **MongoDB**, **Google Gemini AI** on the backend, and **React**, **React Router**, and **Context API** on the frontend.
## 🧱 Project Structure
---
```

studysync/
├─ backend/
│  ├─ config/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ utils/
│  ├─ .env
│  ├─ server.js
│  └─ testGeminiModels.js
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ pages/
│  │  ├─ services/
│  │  ├─ App.test.js
│  │  └─ index.js
└─ README.md

````

---

## ⚙️ Backend Setup (Node.js + Express)

### 📁 Navigate to Backend Folder

```bash
cd backend
````

### 📦 Install Backend Dependencies

```bash
npm install
```

### 🌐 Environment Variables

Create a `.env` file with:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

> 🔒 **Important:** Always change the `JWT_SECRET` and `GEMINI_API_KEY` before deployment. Never commit sensitive credentials to version control.

### ▶️ Start Backend Server

```bash
npm start
```

Runs at: `http://localhost:5000`

---

### 🔌 Backend Dependencies

| Package               | Purpose                            |
| --------------------- | ---------------------------------- |
| express               | Web server and routing             |
| mongoose              | MongoDB ODM for models and schemas |
| bcryptjs              | Password hashing                   |
| jsonwebtoken          | JWT authentication                 |
| dotenv                | Environment variable management    |
| multer                | File upload handling               |
| cors                  | Enable cross-origin requests       |
| @google/generative-ai | Google Gemini API integration      |
| morgan (optional)     | Logging HTTP requests              |

Install via:

```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv multer cors @google/generative-ai
```

---

### 🔗 Backend API Overview

| Route           | Description                          |
| --------------- | ------------------------------------ |
| /api/auth       | User registration and authentication |
| /api/notes      | Upload, fetch, edit, delete notes    |
| /api/flashcards | CRUD flashcards                      |
| /api/quizzes    | Generate/view/attempt quizzes        |
| /api/profile    | Manage user profile                  |
| /api/dashboard  | User dashboard data                  |
| /api/progress   | Track user progress                  |
| /api/users      | Admin-level user control             |

---

### 🤖 Gemini AI Integration

Used for:

* AI-generated summaries
* Smart tag suggestions
* Automatic quiz question generation

Test Gemini model with:

```bash
node testGeminiModels.js
```

---

## 🌐 Frontend Setup (React.js)

### 📁 Navigate to Frontend Folder

```bash
cd frontend
```

### 📦 Install Frontend Dependencies

```bash
npm install
```

### ▶️ Start Development Server

```bash
npm start
```

Runs at: `http://localhost:3000`

> ⚠️ Ensure backend is running at `http://localhost:5000`

---

### 🧩 Frontend Tech Stack

* React.js (Hooks)
* React Router DOM
* Context API
* Axios
* jsPDF (for generating PDF summaries)
* react-icons
* uuid (optional)

Install via:

```bash
npm install react-router-dom axios jspdf react-icons uuid
```

---


### 🎯 Key Features

* ✅ Upload study notes (PDF, DOCX, TXT)
* ✅ Auto-generate summaries, tags, quizzes, and flashcards with AI
* ✅ Visual dashboard and progress tracking
* ✅ Responsive UI with custom CSS styling
* ✅ PDF summary generation using jsPDF
* ✅ Review flashcards and quizzes anytime
* ✅ Secure login & profile management


---

## 🧪 Testing

### React Frontend

```bash
npm test
```

### Gemini AI Backend

```bash
node testGeminiModels.js
```

---

## 📝 License

MIT License

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 👨‍🎓 Built as part of the **StudySync** Project

Pushing AI-powered productivity for students, one quiz at a time.

