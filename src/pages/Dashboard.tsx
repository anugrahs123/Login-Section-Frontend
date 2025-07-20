import {
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Paper,
  Divider,
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

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    localStorage.clear();
    await logout();
    navigate("/login");
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
    </Container>
  );
}
