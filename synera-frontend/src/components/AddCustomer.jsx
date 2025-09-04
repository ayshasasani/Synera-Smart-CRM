import React, { useState } from "react";
import axios from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
} from "@mui/material";

function AddCustomer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // -----------------------
  // Handle field change
  // -----------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on typing
  };

  // -----------------------
  // Validate form
  // -----------------------
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else {
      const phoneRegex = /^[0-9]{10}$/; // example: 10-digit
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Phone must be 10 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------
  // Handle submit
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post("/customers/", formData);
      toast.success("✅ Customer added successfully!");
      navigate("/customers");
    } catch (error) {
      console.error("Error adding customer:", error);
      toast.error("❌ Failed to add customer.");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Add New Customer
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.phone}
              helperText={errors.phone}
            />

            {/* More Details Section */}
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ py: 1.2, fontWeight: "bold", borderRadius: 2 }}
            >
              Save Customer
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddCustomer;
