import React from "react";
import {
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  AutoGraph,
  NotificationsActive,
  Group,
  Dashboard,
} from "@mui/icons-material";

// Features with icons
const features = [
  {
    title: "Automated lead scoring & sentiment analysis",
    icon: <AutoGraph fontSize="inherit" />,
  },
  {
    title: "Real-time notifications & reminders",
    icon: <NotificationsActive fontSize="inherit" />,
  },
  {
    title: "Customer & sales management",
    icon: <Group fontSize="inherit" />,
  },
  {
    title: "Intuitive dashboard with analytics",
    icon: <Dashboard fontSize="inherit" />,
  },
];

// Animation for staggered fade-up
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

const FeaturesSection = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      aria-labelledby="features-heading"
      sx={{
        py: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, ${theme.palette.primary.main}0A, ${theme.palette.secondary.main}0A)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blurred gradient accents */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: theme.palette.primary.light,
          opacity: 0.15,
          filter: "blur(120px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "5%",
          right: "10%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: theme.palette.secondary.light,
          opacity: 0.15,
          filter: "blur(140px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Section Title */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Typography
            id="features-heading"
            variant="h3"
            component="h2"
            fontWeight="bold"
            align="center"
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", md: "2.75rem" },
              mb: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Powerful Features
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ maxWidth: 640, mx: "auto", mb: 10 }}
          >
            Everything you need to manage leads, customers, and sales in one
            intuitive platform designed for modern businesses.
          </Typography>
        </motion.div>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    borderRadius: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    backdropFilter: "blur(12px)",
                    background: `rgba(255,255,255,0.05)`,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: "all 0.35s ease",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.03)",
                      boxShadow: `0 12px 30px rgba(0,0,0,0.15)`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      fontSize: 48,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ lineHeight: 1.4 }}
                  >
                    {feature.title}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
