"use client";

import { Box, Button, Container, Grid, Typography } from "@mui/material";

const Error = ({ error, reset }) => {
  return (
    <Container
      sx={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
          marginBottom: 8,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Something went wrong.
        </Typography>
        <Typography variant="body1">{error.message}</Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={reset}
        >
          Try again
        </Button>
      </Box>
    </Container>
  );
};

export default Error;
