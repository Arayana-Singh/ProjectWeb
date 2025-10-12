import React from "react";
import { Container, CssBaseline } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Teams from "./pages/Teams";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#f50057",
      light: "#ff4081",
      dark: "#c51162",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
      "@media (min-width:600px)": {
        fontSize: "3rem",
      },
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
      "@media (min-width:600px)": {
        fontSize: "2.5rem",
      },
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
      "@media (min-width:600px)": {
        fontSize: "2rem",
      },
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "24px",
          paddingRight: "24px",
          "@media (min-width:600px)": {
            paddingLeft: "32px",
            paddingRight: "32px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
          },
        },
      },
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "16px",
          paddingRight: "16px",
          "@media (min-width:600px)": {
            paddingLeft: "24px",
            paddingRight: "24px",
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <CssBaseline />
          <Navbar />
          <Container
            maxWidth="lg"
            sx={{
              mt: { xs: 2, sm: 4 },
              px: { xs: 1, sm: 2, md: 3 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "calc(100vh - 64px)",
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/teams"
                element={
                  <ProtectedRoute>
                    <Teams />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:projectId"
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/teams" />} />
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
