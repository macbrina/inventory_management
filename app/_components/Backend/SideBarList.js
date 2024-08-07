import { useInventory } from "@/app/_context/InventoryContext";
import { Category } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RestaurantMenu from "@mui/icons-material/RestaurantMenu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";

export const SidebarList = () => {
  const { state } = useInventory();

  return (
    <>
      <Link href="/account/dashboard">
        <ListItemButton
          sx={{
            justifyContent: state.drawerOpen ? "flex-start" : "center",
            paddingBottom: "15px",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: state.drawerOpen ? "56px" : "0px",
            }}
          >
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            sx={{
              display: state.drawerOpen ? "block" : "none",
            }}
          />
        </ListItemButton>
      </Link>
      <Link href="/account/products">
        <ListItemButton
          sx={{
            justifyContent: state.drawerOpen ? "flex-start" : "center",
            paddingBottom: "15px",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: state.drawerOpen ? "56px" : "0px",
            }}
          >
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText
            primary="Products"
            sx={{
              display: state.drawerOpen ? "block" : "none",
            }}
          />
        </ListItemButton>
      </Link>
      <Link href="/account/categories">
        <ListItemButton
          sx={{
            justifyContent: state.drawerOpen ? "flex-start" : "center",
            paddingBottom: "15px",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: state.drawerOpen ? "56px" : "0px",
            }}
          >
            <Category />
          </ListItemIcon>
          <ListItemText
            primary="Categories"
            sx={{
              display: state.drawerOpen ? "block" : "none",
            }}
          />
        </ListItemButton>
      </Link>
      <Link href="/account/cookbook">
        <ListItemButton
          sx={{
            justifyContent: state.drawerOpen ? "flex-start" : "center",
            paddingBottom: "15px",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: state.drawerOpen ? "56px" : "0px",
            }}
          >
            <RestaurantMenu />
          </ListItemIcon>
          <ListItemText
            primary="Cookbook"
            sx={{
              display: state.drawerOpen ? "block" : "none",
            }}
          />
        </ListItemButton>
      </Link>
    </>
  );
};
