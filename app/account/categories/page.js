import CategoryForm from "@/app/_components/Backend/Category/CategoryForm";
import CategoryList from "@/app/_components/Backend/Category/CategoryList";
import { Grid, Stack, Typography } from "@mui/material";
import Head from "next/head";

function Categories() {
  return (
    <>
      <Head>
        <title>Categories</title>
        <meta
          name="description"
          content="Explore various categories and find relevant items."
        />
        <meta name="keywords" content="categories, items, explore" />
      </Head>
      <Grid container spacing={2} style={{ marginTop: 20 }}>
        <Grid item xs={12} md={6}>
          <Stack direction="column" spacing={1} flexGrow="1">
            <Typography variant="h5">Categories</Typography>
            <Typography variant="body1">
              Organize products into categories for better management.
            </Typography>
          </Stack>
        </Grid>

        <CategoryForm />
        <CategoryList />
      </Grid>
    </>
  );
}

export default Categories;
