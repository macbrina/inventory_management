"use client";

import Header from "@/app/_components/Backend/Header";
import SideBarMenu from "@/app/_components/Backend/SideBarMenu";
import ClientOnly from "@/app/_components/ClientOnly";
import { useInventory } from "@/app/_context/InventoryContext";
import { AppBar, Drawer } from "@/app/_util/utilities";
import { Box, Container, CssBaseline, Grid, Toolbar } from "@mui/material";
import CopyRight from "../_components/Backend/CopyRight";
import { useEffect, useState } from "react";
import OfflineNotice from "../_components/OfflineNotice";

function Layout({ children }) {
  const { toggleDrawer, state } = useInventory();

  return (
    <ClientOnly>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={state.drawerOpen}>
          <Header toggleDrawer={toggleDrawer} open={state.drawerOpen} />
        </AppBar>
        <Drawer variant="permanent" open={state.drawerOpen}>
          <SideBarMenu toggleDrawer={toggleDrawer} />
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? "#fff" : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            paddingBottom: "70px",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
          <CopyRight />
        </Box>
      </Box>
    </ClientOnly>
  );
}

export default Layout;
