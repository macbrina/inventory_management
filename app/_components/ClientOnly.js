"use client";

import { useEffect, useState } from "react";
import { useInventory } from "@/app/_context/InventoryContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import getLPTheme from "@/app/_components/getLPTheme";

function ClientOnly({ children }) {
  const [mounted, setMounted] = useState(false);
  const { state } = useInventory();
  const LPtheme = createTheme(getLPTheme(state.themeMode));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <ThemeProvider theme={LPtheme}>{children}</ThemeProvider>;
}

export default ClientOnly;
