import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Edit, Delete } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';

function LeadsList() {
  const [leadsByCustomer, setLeadsByCustomer] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      const response = await api.get('leads/');
      const leads = response.data;

      // Group by customer
      const grouped = leads.reduce((acc, lead) => {
        const customerName = lead.customer?.name || 'Unknown';
        if (!acc[customerName]) acc[customerName] = [];
        acc[customerName].push(lead);
        return acc;
      }, {});

      setLeadsByCustomer(grouped);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`leads/${id}/`);
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const getSentimentChip = (sentiment) => {
    if (!sentiment) return <Chip label="N/A" size="small" />;
    const sentimentMap = {
      positive: { label: '😊 Positive', color: 'success' },
      neutral: { label: '😐 Neutral', color: 'warning' },
      negative: { label: '☹️ Negative', color: 'error' },
    };
    const sentimentLower = sentiment.toLowerCase();
    const { label, color } = sentimentMap[sentimentLower] || { label: sentiment, color: 'default' };
    return <Chip label={label} color={color} size="small" />;
  };

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

  useEffect(() => {
    fetchLeads();
  }, []);

  const filterLeads = (leads) =>
    leads.filter(
      (lead) =>
        (statusFilter === 'all' || lead.status === statusFilter) &&
        (sentimentFilter === 'all' || lead.sentiment?.toLowerCase() === sentimentFilter) &&
        (lead.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
          lead.title?.toLowerCase().includes(search.toLowerCase()))
    );

  // Sort customers by highest average score
  const sortedCustomers = Object.entries(leadsByCustomer).sort(([aName, aLeads], [bName, bLeads]) => {
    const avgA = aLeads.reduce((sum, l) => sum + (l.score || 0), 0) / aLeads.length;
    const avgB = bLeads.reduce((sum, l) => sum + (l.score || 0), 0) / bLeads.length;
    return avgB - avgA;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Leads by Customer</Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton color="primary" onClick={() => navigate('/add-lead')}>
            <AddIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="contacted">Contacted</MenuItem>
            <MenuItem value="qualified">Qualified</MenuItem>
            <MenuItem value="lost">Lost</MenuItem>
            <MenuItem value="won">Won</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Sentiment</InputLabel>
          <Select
            value={sentimentFilter}
            label="Sentiment"
            onChange={(e) => setSentimentFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="positive">Positive</MenuItem>
            <MenuItem value="neutral">Neutral</MenuItem>
            <MenuItem value="negative">Negative</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {sortedCustomers.map(([customer, leads]) => {
        const filteredLeads = filterLeads(leads);
        if (!filteredLeads.length) return null;

        const avgScore = Math.round(
          filteredLeads.reduce((sum, l) => sum + (l.score || 0), 0) / filteredLeads.length
        );

        const sentiments = filteredLeads.map((l) => l.sentiment?.toLowerCase());
        let overallSentiment = 'Neutral';
        if (sentiments.filter((s) => s === 'positive').length > sentiments.filter((s) => s === 'negative').length) {
          overallSentiment = 'Positive';
        } else if (sentiments.filter((s) => s === 'negative').length > sentiments.filter((s) => s === 'positive').length) {
          overallSentiment = 'Negative';
        }

        const sortedLeads = filteredLeads.sort((a, b) => (b.score || 0) - (a.score || 0));

        return (
          <Accordion key={customer} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                <Typography variant="subtitle1" sx={{ flex: 1 }}>{customer}</Typography>
                <Typography variant="body2">Leads: {sortedLeads.length}</Typography>
                <Tooltip title={`Average Score: ${avgScore}`}>
                  <Chip label={avgScore} color={getScoreColor(avgScore)} size="small" />
                </Tooltip>
                <Chip
                  label={overallSentiment}
                  color={overallSentiment === 'Positive' ? 'success' : overallSentiment === 'Negative' ? 'error' : 'warning'}
                  size="small"
                />
              </Stack>
            </AccordionSummary>

            <AccordionDetails>
              {sortedLeads.map((lead) => (
                <Stack
                  key={lead.id}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography sx={{ width: '25%' }}>{lead.title}</Typography>
                  {getStatusChip(lead.status)}
                  <Tooltip title={`Score: ${lead.score}`}>
                    <Chip label={lead.score} color={getScoreColor(lead.score)} size="small" />
                  </Tooltip>
                  {getSentimentChip(lead.sentiment)}
                  <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
                    <IconButton color="primary" onClick={() => navigate(`/edit-lead/${lead.id}`)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(lead.id)}>
                      <Delete />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}

export default LeadsList;
