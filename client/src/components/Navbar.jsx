import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';



export default function Navbar({setIsAuthenticated}) {

  const navigate = useNavigate();

  async function handleLogout() {
 
    const refreshToken = localStorage.getItem("refreshToken");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; 
    try {
      const response = await fetch(`${API_URL}/api/logout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: refreshToken }),
      });

      localStorage.removeItem("accessToken")
      setIsAuthenticated(false);
      navigate("/login")
      const data = response.status; 
      console.log("Successfuly logged out:", data); 

    } catch (err) {
      console.error("Error logging out:", err)
      
    }

  }

  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#1E201E'}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>

            <Link to="/" className='app-title'>Task Trackr</Link>
          </Typography>

          <Button color="inherit" onClick={handleLogout}><Link to="/login" className='logout'>Log Out</Link></Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
