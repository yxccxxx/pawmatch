import React, { useState } from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import DiscoverPage from "./pages/Discover";
import EventPage from "./pages/Event";
import HomePage from "./pages/Home";
import Navbar from "./components/Navbar";
import LogInPage from "./pages/LogIn";
import LogOut from "./pages/LogOut";
import SignUpPage from "./pages/SignUp";
import ProfilePage from "./pages/Profile";

import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      setIsSignedIn(true);
      setUserId(uid);
    } else {
      // User is signed out
      setIsSignedIn(false);
    }
  });

  const requiresLogin = Component => {
    return isSignedIn ? Component : <Navigate to="/login" />;
  };

  return (
    <div>
      <Router>
      <Navbar isSignedIn={isSignedIn} userId={userId} />
        <Routes>
          <Route
            path="/" element={<HomePage isSignedIn={isSignedIn} />} />
          <Route
            path="/discover" element={requiresLogin(<DiscoverPage userId={userId} />)} />
          <Route
            path="/event" element={requiresLogin(<EventPage userId={userId} />)} />
          <Route
            path="/profile" element={requiresLogin(<ProfilePage userId={userId} />)} />
          <Route
            path="/login" 
            element={
              <LogInPage
                onLogIn={() => {
                  setIsSignedIn(true);
                }}
              />
            } 
          />
          <Route
            path="/signup"
            element={
              <SignUpPage onLogIn={() => {
                setIsSignedIn(true);
              }}
              />} 
          />
          <Route
            exact path="/logout" element={<LogOut />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
