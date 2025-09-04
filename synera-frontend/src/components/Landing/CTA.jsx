import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <Box
      sx={{
        py: 12,
        px: 2,
        textAlign: "center",
        background: "linear-gradient(135deg, #1e88e5 0%, #3f51b5 100%)",
        color: "#fff",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Ready to supercharge your sales?
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ py: 1.5, px: 6, fontWeight: "bold" }}
        >
          Sign Up Now
        </Button>
      </motion.div>
    </Box>
  );
};

export default CTA;
