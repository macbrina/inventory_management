import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { v4 as uuidv4 } from "uuid";

import { format, isValid, parse } from "date-fns";

const drawerWidth = 240;

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  color: theme.palette.mode === "light" ? "#131B20" : "#F0F7FF",
  backgroundColor:
    theme.palette.mode === "light"
      ? "rgba(255, 255, 255, 1)"
      : "rgba(0, 0, 0, 0.4)",
  backdropFilter: "blur(24px)",

  boxShadow:
    theme.palette.mode === "light"
      ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
      : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backdropFilter: "blur(24px)",
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(255, 255, 255, 0.4)"
        : "rgba(9, 14, 16, 0.6)",
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good Morning";
  } else if (currentHour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};

export const validateProductEntries = (newItem) => {
  const newErrors = {};

  if (!newItem.name || newItem.name.trim() === "") {
    newErrors.name = "Item name is required";
  }

  if (!newItem.quantity || newItem.quantity <= 0) {
    newErrors.quantity = "Quantity is required and should be greater than 0";
  }

  if (!newItem.category || newItem.category.trim() === "") {
    newErrors.category = "Category is required";
  }

  if (!newItem.expirationDate || newItem.expirationDate.trim() === "") {
    newErrors.expirationDate = "Expiration date is required";
  }

  if (!newItem.purchaseDate || newItem.purchaseDate.trim() === "") {
    newErrors.purchaseDate = "Purchase date is required";
  }

  // Validate and format dates
  const expirationDate = new Date(newItem.expirationDate);
  const purchaseDate = new Date(newItem.purchaseDate);

  if (!newItem.expirationDate || newItem.expirationDate.trim() === "") {
    newErrors.expirationDate = "Expiration date is required";
  } else if (!isValid(expirationDate)) {
    newErrors.expirationDate = "Invalid expiration date format";
  } else {
    newItem.expirationDate = format(expirationDate, "yyyy-MM-dd");
  }

  if (!newItem.purchaseDate || newItem.purchaseDate.trim() === "") {
    newErrors.purchaseDate = "Purchase date is required";
  } else if (!isValid(purchaseDate)) {
    newErrors.purchaseDate = "Invalid purchase date format";
  } else {
    newItem.purchaseDate = format(purchaseDate, "yyyy-MM-dd");
  }

  // Check date order
  if (!newErrors.expirationDate && !newErrors.purchaseDate) {
    if (expirationDate < purchaseDate) {
      newErrors.expirationDate =
        "Expiration date must be after the purchase date";
    }
    if (purchaseDate > expirationDate) {
      newErrors.purchaseDate =
        "Purchase date must be before the expiration date";
    }
  }

  return newErrors;
};

export const generateUniqueId = () => {
  return uuidv4();
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  return format(new Date(dateString), "yyyy-MM-dd");
};

export const parseDateFromInput = (dateString) => {
  if (!dateString) return "";
  return format(parse(dateString, "yyyy-MM-dd", new Date()), "MM/dd/yyyy");
};

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const formatDateIfValid = (dateString) => {
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());
  if (isValid(parsedDate)) {
    return format(parsedDate, "yyyy-MM-dd");
  }
  return dateString;
};

export const generateRandomImageName = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const length = 7;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return `${result}.png`;
};

export function generateRandomColors(numColors) {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  }
  return colors;
}
