"use client";

import RecipeList from "@/app/_components/Backend/Cookbook/RecipeList";
import SearchSuggestion from "@/app/_components/Backend/Cookbook/SearchSuggestion";
import { useAuth } from "@/app/_context/AuthContext";
import { Edit, Kitchen } from "@mui/icons-material";
import { Button, Grid, Stack, Typography } from "@mui/material";
import Head from "next/head";
import { useState } from "react";

function CookBook() {
  const { user, loading: userLoading } = useAuth();
  const [showSuggestion, setShowSuggestion] = useState(false);

  const toggleSuggestion = () => {
    setShowSuggestion((isOpen) => !isOpen);
  };

  return (
    <>
      <Head>
        <title>CookBook - Explore Recipes</title>
        <meta
          name="description"
          content="Explore and discover new recipes based on your pantry items."
        />
        <meta name="keywords" content="recipes, cooking, meal plan" />
      </Head>
      <Grid container spacing={2} style={{ marginTop: 20 }}>
        <Grid item xs={12} md={6}>
          <Stack direction="column" spacing={1} flexGrow="1">
            <Typography variant="h5">Cookbook</Typography>
            <Typography variant="body1">
              Explore and discover new recipes based on your pantry items. Find
              inspiration and create delicious meals with our curated recipe
              suggestions.
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
              startIcon={<Kitchen />}
              onClick={toggleSuggestion}
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
              Pantry Suggestion
            </Button>
          </Stack>
        </Grid>

        <SearchSuggestion
          userLoading={userLoading}
          showSuggestion={showSuggestion}
          user={user}
          toggleSuggestion={toggleSuggestion}
        />

        <RecipeList user={user} userLoading={userLoading} />
      </Grid>
    </>
  );
}

export default CookBook;
