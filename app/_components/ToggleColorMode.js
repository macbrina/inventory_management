"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import ModeNightRoundedIcon from "@mui/icons-material/ModeNightRounded";
import { useInventory } from "@/app/_context/InventoryContext";

function ToggleColorMode() {
  const { state, toggleThemeMode } = useInventory();

  return (
    <Box sx={{ maxWidth: "32px", mr: 2 }}>
      <Button
        variant="text"
        onClick={toggleThemeMode}
        size="small"
        aria-label="button to toggle theme"
        sx={{
          minWidth: "32px",
          height: "32px",
          p: "4px",
          bgcolor: "rgba(85, 166, 246, 0.3)",
        }}
      >
        {state.themeMode === "dark" ? (
          <WbSunnyRoundedIcon fontSize="small" />
        ) : (
          <ModeNightRoundedIcon fontSize="small" />
        )}
      </Button>
    </Box>
  );
}

export default ToggleColorMode;
