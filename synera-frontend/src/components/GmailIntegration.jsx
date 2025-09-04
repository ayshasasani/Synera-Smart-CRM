import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

const GmailIntegration = () => {
  const [connected, setConnected] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if Gmail is already connected
  useEffect(() => {
    axios
      .get("/api/gmail/conversations/", { withCredentials: true })
      .then((res) => {
        setConnected(true);
        setEmails(res.data.messages || []);
      })
      .catch(() => setConnected(false));
  }, []);

  const connectGmail = () => {
    window.location.href = "/gmail-auth/";
  };

  const fetchEmails = () => {
    setLoading(true);
    setError("");
    axios
      .get("/api/gmail/conversations/", { withCredentials: true })
      .then((res) => {
        setEmails(res.data.messages || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch emails. Please try again.");
        setLoading(false);
      });
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "20px auto" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Gmail Integration
        </Typography>

        {!connected ? (
          <Button
            variant="contained"
            color="primary"
            onClick={connectGmail}
          >
            Connect Gmail
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={fetchEmails}
              sx={{ mb: 2 }}
            >
              Fetch Emails
            </Button>

            {loading && <CircularProgress size={24} />}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <List>
              {emails.map((email) => (
                <ListItem key={email.id} divider>
                  <ListItemText primary={email.snippet} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
      {connected && emails.length > 0 && (
        <CardActions>
          <Typography variant="body2" color="textSecondary">
            {emails.length} emails fetched
          </Typography>
        </CardActions>
      )}
    </Card>
  );
};

export default GmailIntegration;
