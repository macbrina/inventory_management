import {
  Divider,
  IconButton,
  List,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { SidebarList } from "@/app/_components/Backend/SideBarList";
import { useInventory } from "@/app/_context/InventoryContext";
import Image from "next/image";
import logo from "@/public/images/logo.png";

function SideBarMenu({ toggleDrawer }) {
  const { state } = useInventory();
  return (
    <>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        {state.drawerOpen && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ mr: 4, alignItems: "center" }}
          >
            <Image
              src={logo}
              quality={80}
              alt="StoreSmart Logo"
              width={30}
              height={30}
            />{" "}
            <Typography variant="h6" color="text.primary" fontWeight="bold">
              StoreSmart
            </Typography>
          </Stack>
        )}
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <SidebarList />
        <Divider sx={{ my: 1 }} />
      </List>
    </>
  );
}

export default SideBarMenu;
