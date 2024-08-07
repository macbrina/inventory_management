"use client";

import ClientOnly from "@/app/_components/ClientOnly";
import { Box, Button, Typography } from "@mui/material";

const Offline = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <ClientOnly>
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? "#fff" : theme.palette.grey[900],
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
          It looks like you have lost your internet connection. Please check
          your connection and try again.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleReload}>
          Try Again
        </Button>
      </Box>
    </ClientOnly>
  );
};

export default Offline;
