import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <Box
      sx={{
        py: 10,
        textAlign: "center",
        backgroundColor: "#1976d2",
        color: "#fff",
      }}
    >
      <Container>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Ready to Boost Your Sales?
        </Typography>
        <Button
          component={Link}
          to="/signup"
          variant="contained"
          size="large"
          sx={{ backgroundColor: "#fff", color: "#1976d2" }}
        >
          Sign Up Now
        </Button>
      </Container>
    </Box>
  );
};

export default CTASection;
