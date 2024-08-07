import { Button, Grid, Stack, Typography } from "@mui/material";

function GeneratedContent({
  generatedNames,
  addingCategory,
  handleNameChange,
  addNewCatgeory,
  generatedCategory,
  showGeneratedCategory,
}) {
  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        {showGeneratedCategory && (
          <Grid item xs={12} display="flex" flexDirection="column" spacing={1}>
            <Typography variant="h6" textAlign="center">
              Generated Category: Add category or select from added ones
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{
                pt: 2,
                pb: 2,
              }}
            >
              <Typography
                variant="body1"
                textAlign="center"
                fontWeight="600"
                color="darkorange"
              >
                {generatedCategory.toUpperCase()}
              </Typography>
              <Button
                onClick={addNewCatgeory}
                variant="contained"
                disabled={addingCategory}
                sx={{
                  backgroundImage: addingCategory
                    ? "linear-gradient(to bottom, #646669, #B5B8BB);"
                    : "linear-gradient(to bottom, #0A66C2, #064079);",
                  color: addingCategory ? "#fff" : "",
                }}
              >
                {addingCategory ? "Adding... " : "Add Category"}
              </Button>
            </Stack>
          </Grid>
        )}
        {generatedNames.length !== 0 && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" textAlign="center">
                Generated Names: Click to select or enter name manually
              </Typography>
            </Grid>
            <Grid container spacing={2}>
              {generatedNames.map((itemName, index) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={(e) => handleNameChange(e, itemName)}
                  >
                    {itemName}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}

export default GeneratedContent;
