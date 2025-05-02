import { Container, Box, Button} from "@mui/material";

export default function Registered() {
  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <p>Thank you for registering!</p>
        <div>
        <Button
              variant="outlined"
              sx={{
                flex: 1,
                borderColor: "#DED0B680",
                color: "#DED0B680",
                "&:hover": {
                  backgroundColor: "rgba(222, 208, 182, 0.75)",
                  borderColor: "rgba(222, 208, 182, 0.75)",
                  color: "rgba(255, 255, 255, 0.87)",
                },
                outline: "none",
                "&:focus": {
                  outline: "none",
                  boxShadow: "none",
                },
              }}
              component="a"
              href="/login"
            >
              Login
            </Button>

        </div>
        
      </Box>
    </Container>
  );
}
