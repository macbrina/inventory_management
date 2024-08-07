import GithubSvg from "@/app/_components/Icons/GithubSvg";
import { githubAuth } from "@/app/_lib/auth";
import { Box, Button } from "@mui/material";

function GitHubSubmit() {
  return (
    <Box component="form" action={githubAuth} noValidate sx={{ mt: 3 }}>
      <Button
        fullWidth
        type="submit"
        variant="outlined"
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
        startIcon={<GithubSvg />}
      >
        Github
      </Button>
    </Box>
  );
}

export default GitHubSubmit;
