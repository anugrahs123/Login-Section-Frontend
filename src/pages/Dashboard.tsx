import {
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../api/auth";
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchUserDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getUserDetails();
      setUser(res);
      console.log("✅ User details refreshed:", res);
    } catch (err: any) {
      console.error("❌ Error fetching user:", err);
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
      <Typography variant="h4" mt={5} gutterBottom>
        Welcome to Dashboard
      </Typography>

      <Box display="flex" gap={2} mt={2}>
        <Button variant="contained" onClick={fetchUserDetails}>
          Refresh User Details
        </Button>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {loading && (
        <Box mt={3}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {user && (
        <Box mt={3}>
          <Typography>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </Typography>
          <Typography>
            <strong>Email:</strong> {user.email}
          </Typography>
        </Box>
      )}
    </Container>
  );
}
