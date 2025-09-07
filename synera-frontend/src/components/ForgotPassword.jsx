import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import API from "../api/api"; // your axios instance

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      await API.post("http://127.0.0.1:8000/api/auth/password/reset/", { email });
      toast.success("Password reset link sent to your email!");
      setEmail("");
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error("Error sending reset email. Try again!");
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
        Forgot Password
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Enter your registered email address and we’ll send you a link to reset
        your password.
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.5 }}>
          Send Reset Link
        </Button>
      </form>
    </Box>
  );
};

export default ForgotPassword;
