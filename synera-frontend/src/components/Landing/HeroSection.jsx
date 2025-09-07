import React from "react";
import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

const HeroSection = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      role="region"
      aria-label="Hero section introducing Smart CRM"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, rgba(25,118,210,0.85), rgba(0,150,136,0.85)), url('/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        textAlign: "center",
        px: 2,
      }}
    >
      {/* Decorative geometric shapes */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        sx={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: theme.palette.primary.light,
          filter: "blur(120px)",
          zIndex: 0,
        }}
      />
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: theme.palette.secondary.light,
          filter: "blur(140px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: "bold",
              mb: 3,
              fontSize: { xs: "2rem", sm: "3rem", md: "3.75rem" },
              lineHeight: 1.2,
            }}
          >
            Transform Your Sales Process
          </Typography>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <Typography
            variant="h6"
            component="p"
            sx={{
              mb: 5,
              fontSize: { xs: "1rem", sm: "1.25rem" },
              maxWidth: 700,
              mx: "auto",
              opacity: 0.9,
            }}
          >
            Smarter CRM, better insights, and automatic lead scoring & follow-ups.
          </Typography>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}
        >
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "2rem",
              fontWeight: "bold",
              "&:hover": {
                transform: "scale(1.05)",
                transition: "0.3s ease",
              },
            }}
          >
            Get Started
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "2rem",
              fontWeight: "bold",
              color: "#fff",
              borderColor: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
                transform: "scale(1.05)",
                transition: "0.3s ease",
              },
            }}
          >
            Login
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
