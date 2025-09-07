import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  MenuItem,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { toast } from "react-toastify";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    role: "sales",
    password1: "",
    password2: "",
  });

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password1 !== formData.password2) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await API.post("auth/registration/", formData);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      if (error.response?.data) {
        const errors = Object.values(error.response.data).flat().join(" ");
        toast.error(errors);
      } else {
        toast.error("Signup failed. Please check your details!");
      }
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://127.0.0.1:8000/accounts/google/login/";
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        mt: 6,
        p: 4,
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "background.paper",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Create Account
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Fill in the details below to sign up
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="flex-start"
        >
          {/* Left Column */}
          <Stack spacing={2} flex={1}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Stack>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
          </Stack>

          {/* Right Column */}
          <Stack spacing={2} flex={1}>
            <TextField
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="sales">Sales</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <TextField
              label="Password"
              name="password1"
              type={showPassword1 ? "text" : "password"}
              value={formData.password1}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword1((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword1 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              name="password2"
              type={showPassword2 ? "text" : "password"}
              value={formData.password2}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword2((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword2 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
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
              Sign Up
            </Button>
          </Stack>
        </Stack>
      </form>

      <Divider sx={{ my: 3 }}>OR</Divider>

      <Button
        variant="contained"
        startIcon={<GoogleIcon />}
        fullWidth
        sx={{
          py: 1.5,
          backgroundColor: "#4285F4",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: 2,
          "&:hover": { backgroundColor: "#357ae8", transform: "scale(1.03)" },
        }}
        onClick={handleGoogleSignup}
      >
        Sign Up with Google
      </Button>
    </Box>
  );
};

export default Signup;
