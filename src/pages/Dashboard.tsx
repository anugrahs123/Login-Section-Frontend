import {
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Paper,
  Divider,
  Snackbar,
  Slide,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserDetails, logout } from "../api/auth";
import { useEffect, useState } from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}
function SlideUpTransition(props: any) {
  return <Slide {...props} direction="down" />;
}
export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success",
  });
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await logout(refreshToken);
      localStorage.clear();
      navigate("/login");
    } catch (error: any) {
      console.error(error);
      setSnackbar({
        open: true,
        message:
          error?.message ||
          "Some issues with logout. Please check your internet connection and try again",
        severity: "error",
      });
    }
  };

  const fetchUserDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getUserDetails();
      setUser(res);
      console.log("User details refreshed:", res);
    } catch (err: any) {
      console.error("Error fetching user:", err);
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails(); // Initial load
  }, []);

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Dashboard
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="center" gap={2} mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchUserDetails}
            >
              Refresh User Details
            </Button>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>

          {loading && (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress size={28} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {user && !loading && (
            <Box mt={3}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Name:</strong> {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Email:</strong> {user.email}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        autoHideDuration={4000}
        TransitionComponent={SlideUpTransition}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
