import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import api from "../api/api";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [highPriorityCount, setHighPriorityCount] = useState(0);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // ---------------- Fetch high-priority leads ----------------
  useEffect(() => {
    if (!user) return;

    const fetchHighPriorityLeads = async () => {
      try {
        const res = await api.get("high-priority-leads/");
        setHighPriorityCount(res.data.length);
      } catch (err) {
        console.error("Error fetching high-priority leads:", err);
      }
    };

    fetchHighPriorityLeads();
    const interval = setInterval(fetchHighPriorityLeads, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // ---------------- Check Gmail connection ----------------
  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams(location.search);
    if (params.get("gmail") === "connected") {
      setGmailConnected(true);
      window.history.replaceState({}, document.title, "/dashboard");
    } else {
      const checkGmailConnection = async () => {
        try {
          const res = await api.get("gmail/conversations/", { withCredentials: true });
          if (res.status === 200) setGmailConnected(true);
        } catch {
          setGmailConnected(false);
        }
      };
      checkGmailConnection();
    }
  }, [user, location]);

  // ---------------- Fetch latest Gmail emails ----------------
  const fetchEmails = async () => {
    setLoadingEmails(true);
    try {
      const res = await api.get("gmail/conversations/", { withCredentials: true });
      setEmails(res.data.messages.slice(0, 5)); // only latest 5 emails
    } catch (err) {
      console.error("Error fetching Gmail emails:", err);
      setEmails([]);
    } finally {
      setLoadingEmails(false);
    }
  };

  const connectGmail = () => {
    window.location.href = "/gmail-auth/";
  };

  const handleMailClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchEmails();
  };

  const handleMailClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box
          component={Link}
          to="/dashboard"
          sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}
        >
          <img src="/Synera logo (2).png" alt="Logo" style={{ height: 80, marginRight: 10 }} />
        </Box>

        {/* Navigation links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user && (
            <>
              <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>

              {user.role === "admin" && (
                <>
                  <Button color="inherit" component={Link} to="/customers">Customers</Button>
                  <Button color="inherit" component={Link} to="/add-customer">Add Customer</Button>
                </>
              )}

              {(user.role === "admin" || user.role === "sales") && (
                <>
                  <Button color="inherit" component={Link} to="/leads">Leads</Button>
                  <Button color="inherit" component={Link} to="/add-lead">Add Lead</Button>
                  <Button color="inherit" component={Link} to="/products">Products</Button>
                </>
              )}
            </>
          )}
        </Box>

        {/* Right-side actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* High-priority leads notification */}
          {user && (user.role === "admin" || user.role === "sales") && (
            <Tooltip title="High-priority leads">
              <IconButton color="inherit" onClick={() => navigate("/high-priority-leads")}>
                <Badge badgeContent={highPriorityCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {/* Gmail integration button */}
          {user && (user.role === "admin" || user.role === "sales") && (
            <>
              <Tooltip title={gmailConnected ? "Gmail Connected" : "Connect Gmail"}>
                <Button
                  color={gmailConnected ? "success" : "inherit"}
                  startIcon={<MailIcon />}
                  variant={gmailConnected ? "contained" : "outlined"}
                  onClick={gmailConnected ? handleMailClick : connectGmail}
                >
                  {gmailConnected ? "Emails" : "Connect Gmail"}
                </Button>
              </Tooltip>

              {/* Gmail dropdown */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMailClose}
                PaperProps={{ style: { width: 350 } }}
              >
                {loadingEmails && (
                  <MenuItem>
                    <CircularProgress size={24} />
                    <Typography sx={{ ml: 1 }}>Loading...</Typography>
                  </MenuItem>
                )}
                {!loadingEmails && emails.length === 0 && (
                  <MenuItem>No emails found</MenuItem>
                )}
                {!loadingEmails &&
                  emails.map((email) => (
                    <MenuItem key={email.id}>
                      <Typography variant="body2">{email.snippet}</Typography>
                    </MenuItem>
                  ))}
              </Menu>
            </>
          )}

          {/* Auth buttons */}
          {user ? (
            <Button color="inherit" onClick={logout}>Logout</Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
