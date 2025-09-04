// src/components/Signup.jsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Divider, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

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
      const payload = { ...formData };
      await API.post("dj-rest-auth/registration/", payload);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      if (error.response && error.response.data) {
        // Show backend validation errors
        const errors = Object.values(error.response.data)
          .flat()
          .join(" ");
        toast.error(errors);
      } else {
        toast.error("Signup failed. Please check your details!");
      }
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 6,
        p: 4,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h5" mb={3} textAlign="center">
        Sign Up
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        </Box>

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="sales">Sales</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>

        <TextField
          label="Password"
          name="password1"
          type="password"
          value={formData.password1}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Confirm Password"
          name="password2"
          type="password"
          value={formData.password2}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5 }}>
          Sign Up
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
        onClick={() => (window.location.href = "http://127.0.0.1:8000/accounts/google/login/")}
      >
        Sign Up with Google
      </Button>
    </Box>
  );
};

export default Signup;
