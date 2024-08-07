import { googleAuth } from "@/app/_lib/auth";
import { Box, Button } from "@mui/material";
import Image from "next/image";
import GoogleSvg from "@/app/_components/Icons/GoogleSvg";

function GoogleSubmit() {
  return (
    <Box component="form" action={googleAuth} noValidate sx={{ mt: 3 }}>
      <Button
        fullWidth
        type="submit"
        variant="outlined"
        startIcon={<GoogleSvg />}
        sx={{
          mt: 3,
          mb: 2,
          p: 3,
          width: {
            xs: "100%", // 100% width on extra-small screens
            sm: "200px", // 80% width on small screens
            md: "200px", // 60% width on medium screens
            lg: "200px", // 40% width on large screens
          },
        }}
      >
        Google
      </Button>
    </Box>
  );
}

export default GoogleSubmit;
