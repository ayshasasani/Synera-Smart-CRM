import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, TextField, Button, Typography, Divider } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both username and password");
      return;
    }

    try {
      // Get JWT tokens
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;

      // Call AuthContext login to fetch user and set context
      await login(accessToken, refreshToken);

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

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 1,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" mb={3}>
        Login
      </Typography>

      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, py: 1.5 }}
        >
          Login
        </Button>
      </form>

      <Divider sx={{ my: 3 }}>OR</Divider>

      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#4285F4",
          "&:hover": { backgroundColor: "#357ae8" },
          py: 1.5,
        }}
        onClick={handleGoogleLogin}
      >
        Login with Google
      </Button>
    </Box>
  );
}

export default Login;
