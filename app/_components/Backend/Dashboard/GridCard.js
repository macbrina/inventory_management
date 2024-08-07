import { Box, Grid, Paper, Skeleton } from "@mui/material";

function GridCard({ loading, loadData, children }) {
  return (
    <Grid item xs={12} md={12} lg={3}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: 150,
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? "#fff" : theme.palette.grey[900],
          backgroundImage: (theme) =>
            theme.palette.mode === "light"
              ? `none`
              : "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
          boxShadow: "rgba(3, 102, 214, 0.3) 0px 0px 0px 2px",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {loading || loadData ? (
            <Skeleton
              variant="rounded"
              type="wave"
              width="100%"
              height="100px"
            />
          ) : (
            children
          )}
        </Box>
      </Paper>
    </Grid>
  );
}

export default GridCard;
