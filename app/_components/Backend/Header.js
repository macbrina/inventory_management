"use client";

import ToggleColorMode from "@/app/_components/ToggleColorMode";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import AvatarDropdown from "./AvatarDropdown";
import { useInventory } from "@/app/_context/InventoryContext";
import Image from "next/image";
import logo from "@/public/images/logo.png";
import Link from "next/link";

function Header({ toggleDrawer, open }) {
  const { state } = useInventory();

  return (
    <Toolbar
      sx={{
        pr: "24px", // keep right padding when drawer closed
      }}
    >
      {!state.drawerOpen && (
        <Stack direction="row" spacing={1} sx={{ mr: 4 }}>
          <Link href="/account/dashboard">
            <Avatar
              src="/images/logo.png"
              alt="StoreSmart Logo"
              sx={{ width: 30, height: 30 }}
            />
          </Link>
        </Stack>
      )}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer}
        sx={{
          marginRight: "36px",
          ...(open && { display: "none" }),
        }}
      >
        <MenuIcon />
      </IconButton>
      <Typography
        component="h1"
        variant="h6"
        color="inherit"
        noWrap
        sx={{ flexGrow: 1 }}
      >
        {state.pathname[0].toUpperCase() + state.pathname.slice(1)}
      </Typography>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <ToggleColorMode />
        <AvatarDropdown />
      </Stack>
    </Toolbar>
  );
}

export default Header;
