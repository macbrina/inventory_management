"use client";
import { useInventory } from "@/app/_context/InventoryContext";
import { alpha, Link } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero({ userLoading, user }) {
  const [email, setEmail] = useState("");
  const { dispatch } = useInventory();
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: "SET_EMAIL", payload: email });
    router.push("/register");
  };

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundImage:
          theme.palette.mode === "light"
            ? "linear-gradient(180deg, #CEE5FD, #FFF)"
            : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
        backgroundSize: "100% 20%",
        backgroundRepeat: "no-repeat",
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: "100%", sm: "70%" } }}>
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignSelf: "center",
              textAlign: "center",
              fontSize: {
                xs: "clamp(1.5rem, 10vw, 4rem)",
                sm: "clamp(1.5rem, 10vw, 4rem)",
                md: "clamp(3.5rem, 10vw, 4rem)",
                lg: "clamp(3.5rem, 10vw, 4rem)",
              },
            }}
          >
            Streamline Your&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: {
                  xs: "clamp(1.5rem, 10vw, 4rem)",
                  sm: "clamp(1.5rem, 10vw, 4rem)",
                  md: "clamp(3.5rem, 10vw, 4rem)",
                  lg: "clamp(3.5rem, 10vw, 4rem)",
                },
                color: (theme) =>
                  theme.palette.mode === "light"
                    ? "primary.main"
                    : "primary.light",
              }}
            >
              Pantry
            </Typography>
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: "center", width: { sm: "100%", md: "80%" } }}
          >
            Keep your pantry organized and your meals planned with ease.
            Streamline your kitchen inventory and never run out of essentials
            again.
          </Typography>
          {!user && !userLoading && (
            <>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignSelf="center"
                alignItems="center"
                spacing={1}
                useFlexGap
                sx={{ pt: 2, width: { xs: "100%", sm: "auto" } }}
              >
                <TextField
                  id="outlined-basic"
                  hiddenLabel
                  size="small"
                  variant="outlined"
                  aria-label="Enter your email address"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  inputProps={{
                    autoComplete: "off",
                    "aria-label": "Enter your email address",
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Start now
                </Button>
              </Stack>
              <Typography
                variant="caption"
                textAlign="center"
                sx={{ opacity: 0.8 }}
              >
                By clicking &quot;Start now&quot; you agree to our&nbsp;
                <Link href="#" color="primary">
                  Terms & Conditions
                </Link>
                .
              </Typography>
            </>
          )}
        </Stack>
        <Box
          id="image"
          sx={(theme) => ({
            mt: { xs: 8, sm: 10 },
            alignSelf: "center",
            height: { xs: 200, sm: 700 },
            width: "100%",
            backgroundImage:
              theme.palette.mode === "light"
                ? 'url("landing/hero-bg.png")'
                : 'url("landing/hero-bg.png")',
            backgroundSize: "cover",
            borderRadius: "10px",
            outline: "1px solid",
            outlineColor:
              theme.palette.mode === "light"
                ? alpha("#BFCCD9", 0.5)
                : alpha("#9CCCFC", 0.1),
            boxShadow:
              theme.palette.mode === "light"
                ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
                : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
          })}
        />
      </Container>
    </Box>
  );
}
