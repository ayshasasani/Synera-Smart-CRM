// src/components/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import API from "../api/api";

const ResetPassword = () => {
  const { uid, token } = useParams(); // from route
  const navigate = useNavigate();

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password1 !== password2) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await API.post("http://127.0.0.1:8000/api/auth/password/reset/confirm/", {
        uid,
        token,
        new_password1: password1,
        new_password2: password2,
      });

      toast.success("Password reset successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Password reset error:", error);
      if (error.response?.data) {
        const errors = Object.values(error.response.data).flat().join(" ");
        toast.error(errors);
      } else {
        toast.error("Failed to reset password. Try again.");
      }
    }
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
        boxShadow: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" mb={3}>
        Reset Password
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          required
        />
        <TextField
          label="Confirm New Password"
          type="password"
          fullWidth
          margin="normal"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, py: 1.5 }}
        >
          Reset Password
        </Button>
      </form>
    </Box>
  );
};

export default ResetPassword;
