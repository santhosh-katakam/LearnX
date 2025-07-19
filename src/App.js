import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Courses from './pages/Courses';
import StudentDetailsForm from './pages/StudentDetailsForm';
import Payment from './pages/Payment';
import PaymentHistory from './pages/PaymentHistory';
import PaymentAnalytics from './pages/PaymentAnalytics';
import PaymentVerification from './pages/PaymentVerification';
import CourseContent from './pages/CourseContent';
import Quiz from './pages/Quiz';
import CourseCompletion from './pages/CourseCompletion';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/payment/:courseId" element={<Payment />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/payment-analytics" element={<PaymentAnalytics />} />
        <Route path="/payment-verification" element={<PaymentVerification />} />
        <Route path="/student-details/:courseId" element={<StudentDetailsForm />} />
        <Route path="/course/:courseId" element={<CourseContent />} />
        <Route path="/quiz/:courseId" element={<Quiz />} />
        <Route path="/completion/:courseId" element={<CourseCompletion />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/edit-course/:courseId" element={<EditCourse />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
