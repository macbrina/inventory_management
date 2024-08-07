"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { logOut } from "@/app/_lib/auth";
import {
  Avatar,
  Box,
  Divider,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
  ListItemIcon,
  Skeleton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { css } from "@mui/system";
import { useState } from "react";
import SpinnerMini from "@/app/_components/SpinnerMini";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AvatarDropdown = () => {
  const { user, loading } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const profilePhoto = user?.image_url?.startsWith("http")
    ? user?.image_url
    : `${process.env.NEXT_PUBLIC_URL}${user?.image_url}`;

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!user) {
        toast.error("User not authenticated");
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        router.push("/login");
      }
      setLoggingOut(true);
      await logOut();
      handleClose();
    } catch (error) {
      toast.error("Failed to log out. Please try again later.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading)
    return (
      <Skeleton animation="wave" variant="circular" width={40} height={40} />
    );

  return (
    <div>
      <Avatar
        sx={{ m: 1, cursor: "pointer" }}
        src={profilePhoto}
        alt="StockSmart Logo"
        onClick={handleAvatarClick}
      />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <Paper sx={{ width: 220, maxWidth: "100%" }}>
          <Box sx={{ px: 2, py: 1.2 }}>
            <Stack direction="column" spacing={1}>
              <Typography
                variant="body1"
                fontWeight="medium"
                fontSize=".975rem"
              >
                {user?.fullname}
              </Typography>
              <Typography
                variant="body1"
                sx={css({
                  marginTop: "3px !important",
                  fontSize: ".775rem",
                })}
              >
                {user?.email}
              </Typography>
            </Stack>
          </Box>
          <Divider />
          <MenuItem onClick={handleSubmit} disabled={loggingOut}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body1" fontWeight="medium" fontSize=".975rem">
              Logout
            </Typography>
          </MenuItem>
        </Paper>
      </Menu>
    </div>
  );
};

export default AvatarDropdown;
