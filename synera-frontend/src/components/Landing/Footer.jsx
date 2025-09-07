import React from "react";
import { Box, Typography, Container, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ py: 4, backgroundColor: "#111", color: "#fff", mt: 5 }}>
      <Container sx={{ textAlign: "center" }}>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Synera CRM. All rights reserved.
        </Typography>
        <Typography variant="body2">
          <Link href="#" color="inherit" sx={{ mx: 1 }}>
            Privacy Policy
          </Link>
          |
          <Link href="#" color="inherit" sx={{ mx: 1 }}>
            Terms
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
