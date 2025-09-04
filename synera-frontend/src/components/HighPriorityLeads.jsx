import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  CircularProgress,
  Tooltip,
  Paper,
  Divider,
} from '@mui/material';

function HighPriorityLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch high-priority leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await api.get('/leads/');
        const allLeads = response.data;
        const highPriorityLeads = allLeads.filter(
          (lead) => (lead.score || 0) >= 80 && !['won', 'lost'].includes(lead.status)
        );
        setLeads(highPriorityLeads);
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const getStatusChip = (status) => {
    const statusMap = {
      new: { label: 'New', color: 'info' },
      contacted: { label: 'Contacted', color: 'primary' },
      qualified: { label: 'Qualified', color: 'success' },
      lost: { label: 'Lost', color: 'error' },
      won: { label: 'Won', color: 'warning' },
    };
    const { label, color } = statusMap[status] || { label: status, color: 'default' };
    return <Chip label={label} color={color} size="small" />;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'error';
    if (score >= 50) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        High-Priority Leads
      </Typography>

      {leads.length === 0 ? (
        <Typography>No high-priority leads at the moment.</Typography>
      ) : (
        <Stack spacing={2}>
          {leads.map((lead) => (
            <Paper
              key={lead.id}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {/* Header row with title, score, status */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {lead.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip title={`Lead Score: ${lead.score}`}>
                    <Chip
                      label={`Score: ${lead.score}`}
                      color={getScoreColor(lead.score)}
                      size="small"
                    />
                  </Tooltip>
                  {getStatusChip(lead.status)}
                </Box>
              </Box>

              <Divider />

              {/* Contact & Company info */}
              <Typography variant="body2" color="textSecondary">
                Company: {lead.customer?.company || 'N/A'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Email: {lead.customer?.email || 'N/A'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Phone: {lead.customer?.phone || 'N/A'}
              </Typography>

              {/* Notes preview */}
              <Typography variant="body2" sx={{ mt: 1 }}>
                Notes: {lead.notes ? lead.notes.substring(0, 80) + '...' : 'No notes'}
              </Typography>

              {/* Follow up button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => navigate(`/edit-lead/${lead.id}`)}
                >
                  Follow Up
                </Button>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default HighPriorityLeads;
