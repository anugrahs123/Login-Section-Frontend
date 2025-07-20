import {
  Container,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
  Slide,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import Joi from "joi";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

function SlideUpTransition(props: any) {
  return <Slide {...props} direction="down" />;
}

// Joi schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: false })
    .required()
    .label("Email")
    .messages({
      "any.required": "Please enter Email address",
      "string.empty": "Please enter Email address",
      "email.invalidFormat": "Please enter a valid email address",
    }),
  password: Joi.string().min(6).required().label("Password").messages({
    "any.required": "Please enter password",
    "string.empty": "Please enter password",
    "string.min": "Password must contain at least 6 characters",
  }),
});

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success",
  });

  const [loading, setLoading] = useState(false);

  const validate = () => {
    const { error } = loginSchema.validate(formData, { abortEarly: false });
    if (!error) {
      setErrors({});
      return true;
    }

    const fieldErrors: { [key: string]: string } = {};
    error.details.forEach((detail) => {
      const field = detail.path[0] as string;
      fieldErrors[field] = detail.message;
    });

    setErrors(fieldErrors);
    return false;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await login(formData);
      if (res?.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error(error);
      setSnackbar({
        open: true,
        message:
          error?.message ||
          "The server is not responding. Please check your internet connection and try again",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
          <Typography variant="h5" gutterBottom align="center">
            Login
          </Typography>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            margin="normal"
            variant="outlined"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            error={Boolean(errors.password)}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            loading={loading}
          >
            Login
          </LoadingButton>
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
