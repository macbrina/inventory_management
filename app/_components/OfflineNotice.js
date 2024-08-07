import { useState, useEffect } from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

const OfflineNotice = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 2,
      }}
    >
      <Typography variant="h3" gutterBottom>
        No Internet Connection
      </Typography>
      <Typography variant="body1" gutterBottom>
        It looks like you have lost your internet connection. Please check your
        connection and try again.
      </Typography>
    </Box>
  );
};

export default OfflineNotice;
