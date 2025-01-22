import { Link } from 'react-router-dom';
import '../styles/navbar.css';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';



export default function Navbar({setIsAuthenticated}) {
  function handleLogout() {
    localStorage.removeItem("token")
    setIsAuthenticated(false);
  }

  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#1E201E'}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>

            <Link to="/" >Task Trackr</Link>
          </Typography>

          <Button color="inherit" onClick={handleLogout}><Link to="/login">Log Out</Link></Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
