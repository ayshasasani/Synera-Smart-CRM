import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";

const Hero = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #3f51b5 0%, #1e88e5 100%)",
        color: "#fff",
        textAlign: "center",
        px: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          Smart CRM Dashboard
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <Typography variant="h6" gutterBottom sx={{ maxWidth: 600, mx: "auto" }}>
          Manage leads, analyze emails, predict lead scores & boost your sales with AI-powered insights.
        </Typography>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="contained"
          sx={{ mt: 3, py: 1.5, px: 4, fontSize: "1rem", fontWeight: "bold" }}
        >
          Get Started <FaRocket style={{ marginLeft: 8 }} />
        </Button>
      </motion.div>
    </Box>
  );
};

export default Hero;
