import { Box, Typography } from "@mui/material";

function GridItem({ imgUrl, total, title }) {
  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box
        component="img"
        src={imgUrl}
        alt="Image"
        sx={{ width: 50, height: 50, marginRight: 2 }}
      />
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h6">{total}</Typography>
        <Typography variant="body1" mt={2} align="center">
          {title}
        </Typography>
      </Box>
    </Box>
  );
}

export default GridItem;
