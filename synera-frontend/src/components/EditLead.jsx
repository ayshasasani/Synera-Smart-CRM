import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { toast } from 'react-toastify';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  CircularProgress,
} from '@mui/material';

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
  const key = sentiment.toLowerCase();
  const { label, color } = sentimentMap[key] || { label: sentiment, color: 'default' };
  return <Chip label={label} color={color} size="small" />;
};

function EditLead() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'new',
    customer_id: '',
  });
  const [leadInfo, setLeadInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('customers/');
        setCustomers(response.data);
      } catch {
        toast.error('Failed to load customers.');
      }
    };

    const fetchLead = async () => {
      try {
        const response = await api.get(`leads/${id}/`);
        const lead = response.data;
        setFormData({
          title: lead.title || '',
          description: lead.description || '',
          status: lead.status || 'new',
          customer_id: lead.customer?.id || '',
        });
        setLeadInfo(lead); // store lead info to show Score & Sentiment
      } catch {
        toast.error('Failed to load lead.');
      }
    };

    fetchCustomers();
    fetchLead();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim() || !formData.customer_id) {
      toast.error('Title and Customer are required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.put(`leads/${id}/`, formData);
      toast.success('Lead updated successfully!');
      setLeadInfo(response.data); // Update lead info to reflect new ML Score & Sentiment
    } catch {
      toast.error('Failed to update lead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Edit Lead
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
          <Stack spacing={3}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="qualified">Qualified</MenuItem>
                <MenuItem value="lost">Lost</MenuItem>
                <MenuItem value="won">Won</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="customer-label">Customer</InputLabel>
              <Select
                labelId="customer-label"
                label="Customer"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select Customer</em>
                </MenuItem>
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" type="submit" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Update Lead'}
            </Button>
          </Stack>
        </Box>

        {/* Display ML Score & Sentiment */}
        {leadInfo && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Lead Analysis
            </Typography>
            <Stack direction="row" spacing={2}>
              <Chip
                label={`Score: ${leadInfo.score}%`}
                color={getScoreColor(leadInfo.score)}
                size="medium"
              />
              {getSentimentChip(leadInfo.sentiment)}
            </Stack>
          </Box>
        )}

        <Button
          variant="text"
          sx={{ mt: 2 }}
          onClick={() => navigate('/leads')}
        >
          Back to Leads List
        </Button>
      </Paper>
    </Box>
  );
}

export default EditLead;
