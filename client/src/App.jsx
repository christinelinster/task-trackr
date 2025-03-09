import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Registered from "./pages/Registered";


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if(accessToken){
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);


  return (
    <Router>
      <Routes>
        <Route exact path="/" element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated}/> : <Login setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/login" element = {isAuthenticated ? <Navigate to="/"/> : <Login setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/registered" element={<Registered/>}/>
      </Routes>
    </Router>
  );
}
