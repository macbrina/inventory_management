"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { inventoryReducer } from "@/app/_context/reducer";
import { usePathname, useRouter } from "next/navigation";

const InventoryContext = createContext();

const initialState = {
  themeMode:
    typeof window !== "undefined"
      ? localStorage.getItem("themeMode") || "dark"
      : "light",
  email: "",
  drawerOpen: false,
  pathname: "",
  productSearch: "",
  categorySearch: "",
  productList: [],
  categoryList: [],
  categoryLoading: false,
  productLoading: false,
  recipeSearch: "",
  recipeList: [],
  recipeLoading: false,
  recipeSuggestions: [],
};

function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);
  const router = useRouter();
  const pathname = usePathname();

  const toggleThemeMode = () => {
    const newThemeMode = state.themeMode === "dark" ? "light" : "dark";
    dispatch({ type: "TOGGLE_THEME_MODE" });
    localStorage.setItem("themeMode", newThemeMode);
  };

  const toggleDrawer = () => {
    dispatch({ type: "TOGGLE_DRAWER_MODE" });
  };

  const updateProductList = useCallback(
    (items) => {
      dispatch({ type: "SET_PRODUCT_LIST", payload: items });
    },
    [dispatch]
  );

  const updateCategoryList = useCallback(
    (items) => {
      dispatch({ type: "SET_CATEGORY_LIST", payload: items });
    },
    [dispatch]
  );

  const updateRecipeList = useCallback(
    (items) => {
      dispatch({ type: "SET_RECIPE_LIST", payload: items });
    },
    [dispatch]
  );

  useEffect(() => {
    document.body.classList.toggle("dark", state.themeMode === "dark");

    return () => {
      document.body.classList.remove("dark", "light");
    };
  }, [state.themeMode]);

  useEffect(() => {
    const handlePathnameChange = () => {
      const pathSegment = pathname.split("/")[2];
      dispatch({ type: "SET_PATHNAME", payload: pathSegment });
    };

    handlePathnameChange();

    // Cleanup if necessary
    return () => {
      window.removeEventListener("popstate", handlePathnameChange);
    };
  }, [pathname, dispatch]);

  return (
    <InventoryContext.Provider
      value={{
        state,
        dispatch,
        toggleThemeMode,
        toggleDrawer,
        updateProductList,
        updateCategoryList,
        updateRecipeList,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

function useInventory() {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }

  return context;
}

export { InventoryProvider, useInventory };
