import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../src/context/AuthProvider';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Account from './pages/Account';
import EmailVerification from './pages/EmailVerification';
import ForgotPassword from './pages/forgotPassword';
import GenerateNewPassword from './pages/generateNewPass';
import FileUploadPage from './pages/FileUploadPage';
import Project from './pages/project';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/about';

export default function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/generatenewpass" element={<GenerateNewPassword />} />
      <Route path="/emailverification" element={<EmailVerification />} />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={isAuthenticated ? <Profile /> : <Navigate to="/signin" />}
      />
      <Route
        path="/account"
        element={isAuthenticated ? <Account /> : <Navigate to="/signin" />}
      />
      <Route
        path="/fileupload/:id"
        element={isAuthenticated ? <FileUploadPage /> : <Navigate to="/signin" />}
      />
      <Route
        path="/project"
        element={isAuthenticated ? <Project /> : <Navigate to="/signin" />}
      />
      <Route
        path="/project/:id"
        element={isAuthenticated ? <ProjectDetail /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
}