
---

## ✅ Complete `frontend/README.md`

```markdown
# StudySync Frontend

The frontend of **StudySync**, a modern learning productivity platform that enables users to:

📘 Upload and manage notes  
🧠 Auto-generate summaries, tags, flashcards, and quizzes using AI  
📊 Track study progress  
📚 Review flashcards and quizzes  
👤 Manage profile and activity  

Built using **React**, **React Router**, **Context API**, and styled with custom CSS.

---

## ⚛️ Tech Stack

- React.js (with hooks)
- React Router DOM
- Context API for state management
- Custom CSS modules
- PDF generation using jsPDF
- Axios for API communication

---

## 📁 Folder Structure

```

frontend/
├─ public/
│  ├─ index.html
│  ├─ manifest.json
│  └─ robots.txt
├─ src/
│  ├─ pages/
│  │  ├─ context/
│  │  │  ├─ noteContext.jsx
│  │  │  ├─ pdfUtils.jsx
│  │  │  └─ quizContext.jsx
│  │  ├─ general/
│  │  │  ├─ auth.css
│  │  │  ├─ landingPage.css
│  │  │  ├─ landingPage.jsx
│  │  │  ├─ login.jsx
│  │  │  ├─ profile.css
│  │  │  ├─ profile.jsx
│  │  │  └─ signup.jsx
│  │  └─ user/
│  │     ├─ attemptquiz.css
│  │     ├─ attemptquiz.jsx
│  │     ├─ dashboard.css
│  │     ├─ dashboard.jsx
│  │     ├─ editnote.css
│  │     ├─ editnote.jsx
│  │     ├─ flashcard.css
│  │     ├─ flashcard.jsx
│  │     ├─ layout.css
│  │     ├─ layout.jsx
│  │     ├─ notes.css
│  │     ├─ notes.jsx
│  │     ├─ progress.css
│  │     ├─ progress.jsx
│  │     ├─ quiz.css
│  │     ├─ quiz.jsx
│  │     ├─ quizattempts.jsx
│  │     ├─ viewnote.css
│  │     └─ viewnote.jsx
│  ├─ services/
│  │  ├─ authService.js
│  │  ├─ flashcardService.js
│  │  ├─ noteService.js
│  │  ├─ profileService.js
│  │  └─ quizService.js
│  ├─ App.test.js
│  ├─ index.css
│  ├─ index.js
│  ├─ reportWebVitals.js
│  └─ setupTests.js
├─ .gitignore
├─ package-lock.json
├─ package.json
└─ README.md

````

---

## 🛠️ Getting Started

### 1. Navigate to Frontend Folder

```bash
cd frontend
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm start
```

By default, it runs at:
📍 `http://localhost:3000`

Make sure the backend is running at `http://localhost:5000` (or update your service URLs accordingly).

---

## 🔑 Environment Setup (Optional)

You can use `.env` if you wish to configure API endpoints dynamically:

```
REACT_APP_BACKEND_URL=http://localhost:5000
```

Use in code like:

```js
const BASE_URL = process.env.REACT_APP_BACKEND_URL;
```

---

## 📦 Frontend Dependencies

| Package          | Purpose                             |
| ---------------- | ----------------------------------- |
| react            | Core React framework                |
| react-router-dom | Routing and navigation              |
| axios            | API requests to the backend         |
| jspdf            | Generate downloadable PDF summaries |
| react-icons      | Icon library used throughout the UI |
| uuid (optional)  | Unique ID generation                |

To install manually:

```bash
npm install react-router-dom axios jspdf react-icons uuid
```

---

## 📌 Key Features

✅ AI-generated summaries, tags, flashcards, and quizzes
✅ Notes upload with document/image support
✅ PDF download of AI-generated summaries
✅ Attempt and review quizzes
✅ Flashcard review system
✅ Visual dashboard for user progress
✅ Fully responsive and styled with custom CSS

---

## 🧩 Services & State Management

* All API calls are handled inside `/src/services/*.js` files
* Global state is managed using React Context in:

  * `noteContext.jsx`
  * `quizContext.jsx`

---

## 📄 PDF Summary Generation

PDFs are generated dynamically on click using `jsPDF`:

* Location: `context/pdfUtils.jsx`
* Triggered from: Notes list view (Download Summary button)

---

## 🔗 Connect to Backend

Make sure your backend (Node.js or Spring Boot) is running on `http://localhost:5000` or update API base URLs inside the service files.

---

## 🧪 Testing

You can run React tests using:

```bash
npm test
```

---

## 📝 License

MIT License

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 👨‍🎓 Built as part of the StudySync Project

Pushing AI-powered productivity for students, one quiz at a time.

```

---
```
