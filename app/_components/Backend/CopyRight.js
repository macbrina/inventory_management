import { Box, Typography } from "@mui/material";
import Link from "next/link";

function CopyRight(props) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 3,
        p: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? "rgba(255, 255, 255, 0.4)"
            : "rgba(9, 14, 16, 0.6)",
        borderTop: (theme) =>
          theme.palette.mode === "light"
            ? "1px solid rgba(191, 204, 217, 0.5)"
            : "1px solid rgba(76, 89, 103, 0.3)",
        color: "text.secondary",
        backdropFilter: "blur(24px)",
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        {"Copyright © "}
        <Link className="link-inherit" href="/">
          StockSmart
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Box>
  );
}

export default CopyRight;
