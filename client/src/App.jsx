import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Registered from "./pages/Registered";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/registered" element={<Registered/>}/>
      </Routes>
    </Router>
  );
}
