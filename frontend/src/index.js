import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { QuizProvider } from './pages/context/quizContext';
import NoteProvider from './pages/context/noteContext';

import LandingPage from './pages/general/landingPage';
import Login from './pages/general/login';
import Signup from './pages/general/signup';
import ProfilePage from './pages/general/profile';

import UserLayout from './pages/user/layout';
import UserDashboard from './pages/user/dashboard';
import FlashcardsPage from './pages/user/flashcard';
import NotesPage from './pages/user/notes';
import ViewNotePage from './pages/user/viewnote';
import EditNotePage from './pages/user/editnote';
import Quizzes from './pages/user/quiz';
import AttemptQuiz from './pages/user/attemptquiz';
import ProgressPage from './pages/user/progress';
import QuizAttempts from './pages/user/quizattempts';

const root = ReactDOM.createRoot(document.getElementById('root'));

const authToken = localStorage.getItem('token');

root.render(
  <QuizProvider>
    <NoteProvider authToken={authToken}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User Routes (Authenticated) */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route index element={<UserDashboard />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="flashcards" element={<FlashcardsPage />} />
            <Route path="my-notes" element={<NotesPage />} />
            <Route path="note/:id" element={<ViewNotePage />} />
            <Route path="note/:id/edit" element={<EditNotePage />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="quizzes/attempt/:id" element={<AttemptQuiz />} />
            <Route path="quizzes/attempts/quiz/:quizId" element={<QuizAttempts />} />
            <Route path="progress" element={<ProgressPage />} />
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </NoteProvider>
  </QuizProvider>
);
