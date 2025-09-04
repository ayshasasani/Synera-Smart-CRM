import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { FaEnvelope, FaChartLine, FaRobot } from "react-icons/fa";

const features = [
  {
    icon: <FaEnvelope size={32} color="#3f51b5" />,
    title: "Gmail Integration",
    description: "Automatically capture customer emails and create leads.",
  },
  {
    icon: <FaRobot size={32} color="#3f51b5" />,
    title: "AI Lead Scoring",
    description: "Predict lead potential using your trained ML model.",
  },
  {
    icon: <FaChartLine size={32} color="#3f51b5" />,
    title: "Sales Analytics",
    description: "Track dashboards and sales metrics in real-time.",
  },
];

const Features = () => {
  return (
    <Box sx={{ py: 12, px: 2, backgroundColor: "#f5f5f5" }}>
      <Typography variant="h4" textAlign="center" fontWeight="bold" mb={8}>
        Features
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {features.map((f, i) => (
          <Grid item xs={12} md={4} key={i}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3, boxShadow: 3 }}>
                <Box mb={2}>{f.icon}</Box>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  {f.title}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {f.description}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Features;
