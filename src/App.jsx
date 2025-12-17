import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import MentorProfile from './pages/MentorProfile'
import ProfileEditor from './pages/ProfileEditor'
import GuidanceRequests from './pages/GuidanceRequests'
import QuestionDetail from './pages/QuestionDetail'
import Discussions from './pages/Discussions'
import SavedMentors from './pages/SavedMentors'
import MyJourney from './pages/MyJourney'
import CountryGuides from './pages/CountryGuides'
import CountryGuideDetail from './pages/CountryGuideDetail'
import GuidanceChat from './pages/GuidanceChat'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mentor/:id" element={<MentorProfile />} />
          <Route path="/profile" element={<ProfileEditor />} />
          <Route path="/requests" element={<GuidanceRequests />} />
          <Route path="/requests/:requestId" element={<GuidanceChat />} />
          <Route path="/question/:id" element={<QuestionDetail />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/saved-mentors" element={<SavedMentors />} />
          <Route path="/my-journey" element={<MyJourney />} />
          <Route path="/guides" element={<CountryGuides />} />
          <Route path="/guides/:slug" element={<CountryGuideDetail />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
