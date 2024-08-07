import { Grid, Paper, Skeleton } from "@mui/material";

function SkeletonTableLoader() {
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
        }}
      >
        <Skeleton
          variant="rounded"
          animation="wave"
          width="100%"
          height="100px"
        />
      </Paper>
    </Grid>
  );
}

export default SkeletonTableLoader;
