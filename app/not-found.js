"use client";

import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NotFound = () => {
  return (
    <Container
      spacing={2}
      sx={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        display: "flex",
        exDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 8,
          marginBottom: 8,
        }}
      >
        <Typography component="h1" variant="h2">
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Oops! Page not found.
        </Typography>
        <Typography variant="body1" align="center">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Link href="/">
          <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Go to Home
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export default NotFound;
