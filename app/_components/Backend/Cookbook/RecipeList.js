"use client";
import RecipeTable from "@/app/_components/Backend/Cookbook/RecipeTable";
import SkeletonTableLoader from "@/app/_components/Backend/SkeletonTableLoader";
import { useInventory } from "@/app/_context/InventoryContext";
import { fetchUserRecipes } from "@/app/_lib/data-service";
import { Grid, Paper } from "@mui/material";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";

function RecipeList({ user, userLoading }) {
  const { state, updateRecipeList, dispatch } = useInventory();
  const memoizedRecipeListLength = useMemo(
    () => state.recipeList.length,
    [state.recipeList]
  );

  useEffect(() => {
    if (!user || memoizedRecipeListLength > 0) return;

    async function fetchRecipes() {
      dispatch({ type: "SET_RECIPE_LOADING", payload: true });

      try {
        await fetchUserRecipes(user, updateRecipeList);
      } catch (error) {
        toast.error("Error fetching recipes:", error);
      } finally {
        dispatch({ type: "SET_RECIPE_LOADING", payload: false });
      }
    }

    fetchRecipes();
  }, [user, dispatch, updateRecipeList, memoizedRecipeListLength]);

  if (userLoading || state.recipeLoading) return;
  <SkeletonTableLoader />;

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
        <RecipeTable items={state.recipeList} user={user} />
      </Paper>
    </Grid>
  );
}

export default RecipeList;
