"use client";

import ClientOnly from "@/app/_components/ClientOnly";
import AppBar from "@/app/_components/LandingPage/AppBar";
import Features from "@/app/_components/LandingPage/Features";
import Footer from "@/app/_components/LandingPage/Footer";
import Hero from "@/app/_components/LandingPage/Hero";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import { useAuth } from "./_context/AuthContext";

export default function LandingPage() {
  const { user, loading: userLoading } = useAuth();
  return (
    <ClientOnly>
      <CssBaseline />
      <AppBar user={user} userLoading={userLoading} />
      <Hero user={user} userLoading={userLoading} />
      <Box sx={{ bgcolor: "background.default" }}>
        <Features />
        <Divider />
        <Footer />
      </Box>
    </ClientOnly>
  );
}
