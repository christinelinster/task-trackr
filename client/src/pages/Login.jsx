import "../styles/login.css";
import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login({ setIsAuthenticated }) {
  const [showPassword, setShowPassword] = useState(false);
  async function handleLogin(e) {
    e.preventDefault();

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const username = e.target.username.value;
    const password = e.target.password.value;

    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (!response) {
      console.log("did not get");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setIsAuthenticated(true);
  }

  return (
    <Container maxWidth="xs">
    
      <form className="login-form" onSubmit={handleLogin}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <Typography variant="h5" component="h1" gutterBottom>
            Login to Task Trackr
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            sx={{
              input: { color: "rgba(255, 255, 255, 0.87)" },
              "& label": {
                color: "rgba(255, 255, 255, 0.87)",
              },
              "& label.Mui-focused": {
                color: "rgba(222, 208, 182, 0.50)",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
              },
            }}
            label="Username"
            name="username"
            type="text"
          />
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            required
            sx={{
              input: { color: "rgba(255, 255, 255, 0.87)" },
              "& label": {
                color: "rgba(255, 255, 255, 0.87)",
              },
              "& label.Mui-focused": {
                color: "rgba(222, 208, 182, 0.50)",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    sx={{
                      color: "rgba(255, 255, 255, 0.5)",
                      outline: "none",
                      "&:focus": {
                        outline: "none",
                        boxShadow: "none",
                      },
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box display="flex" gap={2} width="100%" mt={2}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                flex: 1,
                backgroundColor: "#DED0B680",
                outline: "none",
                "&:focus": {
                  outline: "none",
                  boxShadow: "none",
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              sx={{
                flex: 1,
                borderColor: "#DED0B680",
                color: "#DED0B680",
                "&:hover": {
                  backgroundColor: "rgba(222, 208, 182, 0.75)",
                  borderColor: "rgba(222, 208, 182, 0.75)",
                  color: "rgba(255, 255, 255, 0.87)",
                },
                outline: "none",
                "&:focus": {
                  outline: "none",
                  boxShadow: "none",
                },
              }}
              component="a"
              href="/signup"
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </form>
    </Container>
  );
}
