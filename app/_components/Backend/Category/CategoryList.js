"use client";
import CategoryTable from "@/app/_components/Backend/Category/CategoryTable";
import SkeletonTableLoader from "@/app/_components/Backend/SkeletonTableLoader";
import { useAuth } from "@/app/_context/AuthContext";
import { useInventory } from "@/app/_context/InventoryContext";
import { fetchUserCategories } from "@/app/_lib/data-service";
import { Grid, Paper } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

function CategoryList() {
  const { user, loading } = useAuth();
  const { state, updateCategoryList, dispatch } = useInventory();
  const memoizedCategoryListLength = useMemo(
    () => state.categoryList.length,
    [state.categoryList]
  );

  useEffect(() => {
    if (!user || memoizedCategoryListLength > 0) return;

    async function fetchCategories() {
      dispatch({ type: "SET_CATEGORY_LOADING", payload: true });

      try {
        await fetchUserCategories(user, updateCategoryList);
      } catch (error) {
        toast.error("Error fetching categories:", error);
      } finally {
        dispatch({ type: "SET_CATEGORY_LOADING", payload: false });
      }
    }

    fetchCategories();
  }, [user, dispatch, updateCategoryList, memoizedCategoryListLength]);

  if (loading || state.categoryLoading) return <SkeletonTableLoader />;
  return (
    <Grid
      item
      xs={12}
      sx={{
        paddingRight: "0px",
      }}
    >
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? "#fff" : theme.palette.grey[900],
          backgroundImage: (theme) =>
            theme.palette.mode === "light"
              ? `none`
              : "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
          boxShadow: "rgba(3, 102, 214, 0.3) 0px 0px 0px 2px",

          overflow: "hidden",
          overflowX: "auto",
          overflowY: "auto",
        }}
      >
        <CategoryTable items={state.categoryList} user={user} />
      </Paper>
    </Grid>
  );
}

export default CategoryList;
