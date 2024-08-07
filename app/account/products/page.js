"use client";

import ProductList from "@/app/_components/Backend/Products/ProductList";
import ProductForm from "@/app/_components/Backend/Products/ProductForm";
import { Add, Camera, Search as SearchIcon } from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CameraProductForm from "@/app/_components/Backend/Products/CameraProductForm";
import { useInventory } from "@/app/_context/InventoryContext";
import { useAuth } from "@/app/_context/AuthContext";
import Head from "next/head";
import ClientOnly from "@/app/_components/ClientOnly";

function Products() {
  const [cameraUpload, setCameraUpload] = useState(false);
  const [normalUpload, setNormalUpload] = useState(false);
  const { state, dispatch } = useInventory();
  const { loading: userLoading } = useAuth();

  const toggleCameraForm = () => {
    setCameraUpload((isOpen) => !isOpen);

    if (normalUpload) setNormalUpload(false);
  };

  const toggleNormalForm = () => {
    setNormalUpload((isOpen) => !isOpen);

    if (cameraUpload) setCameraUpload(false);
  };

  return (
    <>
      <Head>
        <title>Manage Your Pantries</title>
        <meta
          name="description"
          content="Add and manage your pantry items easily. Keep track of what's available in your pantry to make meal planning more efficient."
        />
        <meta
          name="keywords"
          content="pantry, manage pantry, pantry items, meal planning"
        />
      </Head>
      <ClientOnly>
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item xs={12} md={6}>
            <Stack direction="column" spacing={1} flexGrow="1">
              <Typography variant="h5">Products</Typography>
              <Typography variant="body1">
                Manage and display your pantry items efficiently.
              </Typography>
            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: {
                xs: "flex-start",
                sm: "flex-start",
                md: "flex-end",
                lg: "flex-end",
              },
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                type="button"
                variant="outlined"
                onClick={toggleNormalForm}
                startIcon={<Add />}
                sx={{
                  mt: 3,
                  mb: 2,
                  p: 3,
                  width: {
                    xs: "100%",
                    sm: "200px",
                    md: "200px",
                    lg: "200px",
                  },
                }}
              >
                Add Product
              </Button>
              <Button
                fullWidth
                type="button"
                variant="outlined"
                onClick={toggleCameraForm}
                startIcon={<Camera />}
                sx={{
                  mt: 3,
                  mb: 2,
                  p: 3,
                  width: {
                    xs: "100%",
                    sm: "200px",
                    md: "200px",
                    lg: "200px",
                  },
                }}
              >
                Use Webcam
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            {state.productLoading || userLoading ? (
              <Skeleton variant="rounded" width="100%" height="60px" />
            ) : (
              <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={state.productSearch}
                onChange={(e) =>
                  dispatch({ type: "SEARCH_PRODUCTS", payload: e.target.value })
                }
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            )}
          </Grid>

          {normalUpload && (
            <ProductForm
              normalUpload={normalUpload}
              toggleNormalForm={toggleNormalForm}
            />
          )}
          {cameraUpload && (
            <CameraProductForm
              cameraUpload={cameraUpload}
              toggleCameraForm={toggleCameraForm}
            />
          )}
          <ProductList />
        </Grid>
      </ClientOnly>
    </>
  );
}

export default Products;
