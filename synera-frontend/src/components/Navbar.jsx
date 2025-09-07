import React, { useContext, useEffect, useMemo, useState } from "react";
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
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  ListItemIcon,
  useTheme,
  Paper,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import api from "../api/api";

/* ------------------------------- Styled UI ------------------------------- */

// Glassmorphic AppBar with gradient sheen and subtle depth
const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(180deg,
    ${alpha(theme.palette.background.paper, 0.65)} 0%,
    ${alpha(theme.palette.background.paper, 0.45)} 100%)`,
  backdropFilter: "saturate(180%) blur(14px)",
  WebkitBackdropFilter: "saturate(180%) blur(14px)", // Safari
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 24px rgba(0,0,0,0.35)"
      : "0 8px 20px rgba(0,0,0,0.12)",
  transition: "background 240ms ease, box-shadow 240ms ease, border-color 240ms ease",
}));

// Gradient brand text
const Brand = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: 0.2,
  background:
    theme.palette.mode === "dark"
      ? `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`
      : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  userSelect: "none",
}));

// Primary nav button with active underline + subtle hover lift
const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  position: "relative",
  padding: "8px 14px",
  borderRadius: 12,
  textTransform: "none",
  fontWeight: 600,
  letterSpacing: 0.2,
  color: theme.palette.text.primary,
  transition: "transform 200ms ease, background 200ms ease",
  "&:hover": {
    transform: "translateY(-1px)",
    background: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.12 : 0.06),
  },
  ...(active && {
    background: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.16 : 0.08),
  }),
  // active underline
  "&::after": {
    content: '""',
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 6,
    height: 2,
    borderRadius: 2,
    background:
      active
        ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        : "transparent",
    transition: "background 200ms ease",
  },
}));

// Glass card for email menu & mobile drawer paper
const GlassPaper = styled(Paper)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.6),
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 10px 30px rgba(0,0,0,0.35)"
      : "0 10px 24px rgba(0,0,0,0.12)",
}));

// Icon button with glass hover ring
const GlassIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 12,
  transition: "transform 180ms ease, background 180ms ease, box-shadow 180ms ease",
  "&:hover": {
    transform: "translateY(-1px)",
    background: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.18 : 0.08),
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 6px 14px rgba(0,0,0,0.35)"
        : "0 6px 16px rgba(0,0,0,0.12)",
  },
}));

// Gradient CTA-like Gmail button
const GmailButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "connected",
})(({ theme, connected }) => ({
  textTransform: "none",
  fontWeight: 700,
  borderRadius: 14,
  padding: "8px 14px",
  letterSpacing: 0.2,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
  ...(connected
    ? {
        color: theme.palette.getContrastText(theme.palette.success.main),
        background: `linear-gradient(45deg, ${alpha(
          theme.palette.success.main,
          0.95
        )}, ${alpha(theme.palette.success.dark, 0.95)})`,
      }
    : {
        color: theme.palette.text.primary,
        background: alpha(theme.palette.background.paper, 0.3),
      }),
  "&:hover": {
    transform: "translateY(-1px)",
    background: connected
      ? `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`
      : alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.22 : 0.12),
  },
  transition: "transform 180ms ease, background 180ms ease, border 180ms ease",
}));

/* ------------------------------ Component ------------------------------ */

const Navbar = () => {
  const theme = useTheme();
  const { user, logout } = useContext(AuthContext);
  const [highPriorityCount, setHighPriorityCount] = useState(0);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:900px)");

  // Build menu definitions once (keeps parity for desktop & mobile)
  const navLinks = useMemo(() => {
    const links = [];
    if (user) links.push({ to: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> });

    if (user?.role === "admin") {
      links.push({ to: "/customers", label: "Customers", icon: <GroupIcon /> });
      links.push({ to: "/add-customer", label: "Add Customer", icon: <AddCircleOutlineIcon /> });
    }

    if (user && (user.role === "admin" || user.role === "sales")) {
      links.push({ to: "/leads", label: "Leads", icon: <GroupIcon /> });
      links.push({ to: "/add-lead", label: "Add Lead", icon: <AddCircleOutlineIcon /> });
      links.push({ to: "/products", label: "Products", icon: <ShoppingBagIcon /> });
    }
    return links;
  }, [user]);

  /* -------------------- Data: leads & Gmail connection ------------------- */

  useEffect(() => {
    if (!user) return;

    const fetchHighPriorityLeads = async () => {
      try {
        const res = await api.get("high-priority-leads/");
        setHighPriorityCount(res.data.length);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHighPriorityLeads();
    const interval = setInterval(fetchHighPriorityLeads, 60000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams(location.search);
    if (params.get("gmail") === "connected") {
      setGmailConnected(true);
      window.history.replaceState({}, document.title, "/dashboard");
    } else {
      const checkGmail = async () => {
        try {
          const res = await api.get("gmail/conversations/", { withCredentials: true });
          if (res.status === 200) setGmailConnected(true);
        } catch {
          setGmailConnected(false);
        }
      };
      checkGmail();
    }
  }, [user, location]);

  const fetchEmails = async () => {
    setLoadingEmails(true);
    try {
      const res = await api.get("gmail/conversations/", { withCredentials: true });
      setEmails((res.data?.messages || []).slice(0, 5));
    } catch (err) {
      console.error(err);
      setEmails([]);
    } finally {
      setLoadingEmails(false);
    }
  };

  const connectGmail = () => (window.location.href = "/gmail-auth/");

  const handleMailClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchEmails();
  };
  const handleMailClose = () => setAnchorEl(null);

  const toggleMobileMenu = () => setMobileOpen((p) => !p);

  /* ---------------------------- Render helpers --------------------------- */

  const isActive = (to) => location.pathname.startsWith(to);

  /* -------------------------------- Render ------------------------------- */

  return (
    <>
      <GlassAppBar position="sticky" color="transparent" elevation={0} aria-label="Primary navigation">
        <Toolbar
          sx={{
            gap: 2,
            justifyContent: "space-between",
            minHeight: { xs: 64, md: 72 },
          }}
        >
          {/* Brand */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              gap: 1.25,
              px: 1,
              py: 0.5,
              borderRadius: 2,
              transition: "transform 180ms ease, background 180ms ease",
              "&:hover": {
                transform: "translateY(-1px)",
                background: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.18 : 0.08),
              },
            }}
            aria-label="Go to homepage"
          >
           <Avatar
              src="/Synera logo (3).png"
              alt="Synera logo"
              variant="square"
              sx={{
                width: 100, // increased size for visibility
                height: 80,
                borderRadius: 1,
                objectFit: "contain",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(0,0,0,0.6)"
                    : "0 4px 8px rgba(0,0,0,0.15)",
                backgroundColor: "transparent", // ✅ removes overlay tint
                border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`, // optional subtle border for separation
              }}
              imgProps={{
                loading: "lazy",
                decoding: "async",
                style: { objectFit: "contain" }, // ensures proper scaling
              }}
            />

            <Brand variant="h6" component="span">
              Synera CRM
            </Brand>
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              {navLinks.map((item) => (
                <NavButton
                  key={item.to}
                  component={Link}
                  to={item.to}
                  active={isActive(item.to) ? 1 : 0}
                  aria-current={isActive(item.to) ? "page" : undefined}
                >
                  {item.label}
                </NavButton>
              ))}

              {/* High-priority leads */}
              {user && (user.role === "admin" || user.role === "sales") && (
                <Tooltip title="High-priority leads">
                  <GlassIconButton
                    color="inherit"
                    onClick={() => navigate("/high-priority-leads")}
                    aria-label={`High-priority leads: ${highPriorityCount}`}
                  >
                    <Badge
                      badgeContent={highPriorityCount}
                      color="error"
                      overlap="rectangular"
                      slotProps={{
                        badge: { sx: { fontWeight: 700 } },
                      }}
                    >
                      <NotificationsIcon />
                    </Badge>
                  </GlassIconButton>
                </Tooltip>
              )}

              {/* Gmail button + menu */}
              {user && (user.role === "admin" || user.role === "sales") && (
                <>
                  <Tooltip title={gmailConnected ? "View recent emails" : "Connect Gmail"}>
                    <GmailButton
                      connected={gmailConnected ? 1 : 0}
                      startIcon={<MailIcon />}
                      variant={gmailConnected ? "contained" : "outlined"}
                      onClick={gmailConnected ? handleMailClick : connectGmail}
                      aria-haspopup="menu"
                      aria-controls={gmailConnected ? "gmail-menu" : undefined}
                    >
                      {gmailConnected ? "Emails" : "Connect Gmail"}
                    </GmailButton>
                  </Tooltip>

                  <Menu
                    id="gmail-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMailClose}
                    PaperProps={{
                      component: GlassPaper,
                      sx: { width: 360, p: 0.5, overflow: "hidden" },
                      elevation: 0,
                    }}
                    disableScrollLock
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={800}>
                        Recent Emails
                      </Typography>
                      {loadingEmails && <CircularProgress size={18} aria-label="Loading emails" />}
                    </Box>
                    <Divider />
                    {!loadingEmails && emails.length === 0 && (
                      <MenuItem disabled>
                        <Typography variant="body2">No emails found</Typography>
                      </MenuItem>
                    )}
                    {!loadingEmails &&
                      emails.map((email) => (
                        <MenuItem key={email.id} sx={{ alignItems: "flex-start", py: 1.25 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {email.snippet}
                          </Typography>
                        </MenuItem>
                      ))}
                  </Menu>
                </>
              )}

              {/* Auth */}
              {user ? (
                <Tooltip title="Logout">
                  <Button
                    color="inherit"
                    onClick={logout}
                    startIcon={<LogoutIcon />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: 2,
                      "&:hover": {
                        background: alpha(
                          theme.palette.error.main,
                          theme.palette.mode === "dark" ? 0.24 : 0.12
                        ),
                      },
                    }}
                  >
                    Logout
                  </Button>
                </Tooltip>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/signup"
                    startIcon={<AppRegistrationIcon />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 800,
                      borderRadius: 2,
                      background: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.24 : 0.12),
                      "&:hover": {
                        background: alpha(
                          theme.palette.primary.main,
                          theme.palette.mode === "dark" ? 0.34 : 0.18
                        ),
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* Mobile menu trigger */}
          {isMobile && (
            <GlassIconButton
              color="inherit"
              onClick={toggleMobileMenu}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </GlassIconButton>
          )}
        </Toolbar>
      </GlassAppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          component: GlassPaper,
          sx: { width: 300, p: 1.5 },
          elevation: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1, pb: 1 }}>
          <Avatar
            src="/Synera logo (2).png"
            alt="Synera logo"
            variant="rounded"
            sx={{ width: 36, height: 36, borderRadius: 2 }}
          />
          <Brand variant="subtitle1">Synera CRM</Brand>
        </Box>
        <Divider sx={{ mb: 1 }} />

        <List component="nav" aria-label="Mobile primary navigation">
          {navLinks.map((item) => (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              onClick={toggleMobileMenu}
              selected={isActive(item.to)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  background: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.24 : 0.12),
                },
                "&:hover": {
                  background: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.2 : 0.08),
                },
              }}
            >
              {item.icon && <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>}
              <ListItemText primaryTypographyProps={{ fontWeight: 700 }} primary={item.label} />
            </ListItemButton>
          ))}

          {user && (user.role === "admin" || user.role === "sales") && (
            <>
              <ListItemButton
                onClick={() => {
                  navigate("/high-priority-leads");
                  toggleMobileMenu();
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  "&:hover": {
                    background: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.2 : 0.08),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Badge badgeContent={highPriorityCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{ fontWeight: 700 }}
                  primary={`High-priority leads (${highPriorityCount})`}
                />
              </ListItemButton>

              <ListItemButton
                onClick={() => {
                  if (gmailConnected) {
                    // replicate desktop behavior—open email menu anchored to nothing in drawer
                    // For mobile, we can navigate to a dedicated emails page if exists; if not, trigger connect/view
                    handleMailClick({ currentTarget: document.body });
                  } else {
                    connectGmail();
                  }
                  toggleMobileMenu();
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  "&:hover": {
                    background: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.2 : 0.08),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{ fontWeight: 700 }}
                  primary={gmailConnected ? "Emails" : "Connect Gmail"}
                />
              </ListItemButton>
            </>
          )}

          <Divider sx={{ my: 1 }} />

          {user ? (
            <ListItemButton
              onClick={() => {
                logout();
                toggleMobileMenu();
              }}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontWeight: 700 }} primary="Logout" />
            </ListItemButton>
          ) : (
            <>
              <ListItemButton
                component={Link}
                to="/login"
                onClick={toggleMobileMenu}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontWeight: 700 }} primary="Login" />
              </ListItemButton>
              <ListItemButton
                component={Link}
                to="/signup"
                onClick={toggleMobileMenu}
                sx={{ borderRadius: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <AppRegistrationIcon />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontWeight: 700 }} primary="Sign Up" />
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
