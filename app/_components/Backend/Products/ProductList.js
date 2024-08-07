"use client";

import Spinner from "@/app/_components/Spinner";
import { useAuth } from "@/app/_context/AuthContext";
import { useInventory } from "@/app/_context/InventoryContext";
import { fetchUserItems } from "@/app/_lib/data-service";
import { useEffect, useMemo, useState } from "react";
import ProductTable from "@/app/_components/Backend/Products/ProductTable";
import { Grid, Paper } from "@mui/material";
import SkeletonTableLoader from "@/app/_components/Backend/SkeletonTableLoader";
import { toast } from "react-toastify";

function ProductList() {
  const { user, loading } = useAuth();
  const { state, updateProductList, dispatch } = useInventory();
  const memoizedProductListLength = useMemo(
    () => state.productList.length,
    [state.productList]
  );

  useEffect(() => {
    if (!user || memoizedProductListLength > 0) return;

    const fetchProducts = async () => {
      dispatch({ type: "SET_PRODUCT_LOADING", payload: true });

      try {
        await fetchUserItems(user, updateProductList);
      } catch (error) {
        toast.error("Error fetching products:", error);
      } finally {
        dispatch({ type: "SET_PRODUCT_LOADING", payload: false });
      }
    };

    fetchProducts();
  }, [user, dispatch, updateProductList, memoizedProductListLength]);

  if (loading || state.productLoading) return <SkeletonTableLoader />;

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
        <ProductTable items={state.productList} user={user} />
      </Paper>
    </Grid>
  );
}

export default ProductList;
