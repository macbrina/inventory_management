"use client";

import GitHubSubmit from "@/app/_components/Auth/GitHubSubmit";
import GoogleSubmit from "@/app/_components/Auth/GoogleSubmit";
import getLPTheme from "@/app/_components/getLPTheme";
import { useInventory } from "@/app/_context/InventoryContext";
import { signUpSystem } from "@/app/_lib/auth";
import { Stack } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const { state } = useInventory();
  const LPtheme = createTheme(getLPTheme(state.themeMode));
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setIsPending(true);

    try {
      await signUpSystem({ fullName, email, password });
      toast.success("Signed in successfully!");

      router.push("/account/dashboard");
    } catch (error) {
      if (error.code) {
        if (error.code === "auth/weak-password") {
          toast.error("Password should be at least 6 characters.");
        } else {
          toast.error(
            "Authentication failed. Please check your credentials and try again."
          );
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setIsPending(false);
      }
    }
  };

  return (
    <ThemeProvider theme={LPtheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={false}
          md={7}
          sx={{
            position: "relative",
            backgroundImage: 'url("/landing/signup-bg.png")',
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "left",
            "::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(5px)", // Blur effect
            },
          }}
        />
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Link href="/">
              <Avatar
                sx={{ m: 1 }}
                src="/images/logo.png"
                alt="StockSmart Logo"
              />
            </Link>

            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="fullName"
                label="Full Name"
                name="fullName"
                autoComplete="fullName"
                autoFocus
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                type="email"
                label="Email Address"
                name="email"
                defaultValue={state.email || email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  "&.Mui-disabled": {
                    color: "#fff",
                    backgroundImage:
                      "linear-gradient(to bottom, #646669, #B5B8BB)",
                  },
                }}
                disabled={pending}
              >
                <Typography variant="body3" color="white">
                  {pending ? "Signing Up..." : "Sign Up"}
                </Typography>
              </Button>
              <Grid container display="flex" justifyContent="end">
                <Grid item>
                  <Link className="link" href="/login" variant="body2">
                    {"Already have an account? Sign in"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              <Typography variant="body2" color="text.secondary" align="center">
                Or With
              </Typography>
              <Box>
                <Stack direction="row" spacing={3}>
                  <GoogleSubmit />
                  <GitHubSubmit />
                </Stack>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
