import React, { useState, useContext } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Stack,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      const { access, refresh } = response.data;
      await login(access, refresh);

      toast.success("Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Invalid username or password");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:8000/accounts/google/login/";
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        maxWidth: 420,
        mx: "auto",
        mt: 8,
        p: 5,
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "background.paper",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Welcome Back
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Please login to your account
      </Typography>

      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <Stack spacing={2}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Forgot Password Link */}
          <Box sx={{ textAlign: "right", mt: -1 }}>
            <Link
              component={RouterLink}
              to="/forgot-password"
              variant="body2"
              underline="hover"
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": { transform: "scale(1.03)" },
            }}
          >
            Login
          </Button>
        </Stack>
      </form>

      <Divider sx={{ my: 3 }}>OR</Divider>

      <Button
        variant="contained"
        startIcon={<GoogleIcon />}
        fullWidth
        onClick={handleGoogleLogin}
        sx={{
          py: 1.5,
          backgroundColor: "#4285F4",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: 2,
          "&:hover": { backgroundColor: "#357ae8", transform: "scale(1.03)" },
        }}
      >
        Login with Google
      </Button>
    </Box>
  );
};

export default Login;
