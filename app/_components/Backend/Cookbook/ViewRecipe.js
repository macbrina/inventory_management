"use client";

import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import ReactPlayer from "react-player/youtube";

const ViewRecipe = ({ openViewModal, setOpenViewModal, recipe }) => {
  return (
    <Dialog
      open={openViewModal}
      onClose={() => setOpenViewModal(false)}
      PaperProps={{
        style: {
          width: "70%",
          maxWidth: "none",
        },
      }}
    >
      <DialogTitle>{recipe?.recipeName}</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Ingredients:
        </Typography>
        <List>
          {recipe?.ingredients.map((ingredient, idx) => (
            <ListItem key={idx}>
              <ListItemText
                primary={`${ingredient.quantity} ${ingredient.unit} ${ingredient.ingredientName}`}
              />
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" gutterBottom marginTop={2}>
          Instructions:
        </Typography>
        {recipe?.instructions.split("\n").map((step, idx) => (
          <Typography key={idx} paragraph>
            {step}
          </Typography>
        ))}

        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12}>
            <Typography>
              <strong>Preparation Time:</strong> {recipe?.preparationTime}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Cooking Time:</strong> {recipe?.cookingTime}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Total Time:</strong> {recipe?.totalTime}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <strong>Serving Size:</strong> {recipe?.servingSize}
            </Typography>
          </Grid>
          {recipe?.youtubeUrl && (
            <Grid item xs={12} marginTop={2}>
              {!recipe.youtubeUrl ||
              recipe.youtubeUrl == "No relevant video found" ? (
                <Typography variant="h6" gutterBottom>
                  No Video Available
                </Typography>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    Watch Video:
                  </Typography>{" "}
                  <ReactPlayer
                    url={recipe.youtubeUrl}
                    width="100%"
                    height="600px"
                  />
                </>
              )}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => setOpenViewModal(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewRecipe;
