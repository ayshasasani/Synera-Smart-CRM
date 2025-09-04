import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/customers/');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`/customers/${id}/`);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">Customers</Typography>
        <Button
          variant="contained"
          component={Link}
          to="/add-customer"
          startIcon={<AddIcon />}
        >
          Add Customer
        </Button>
      </Stack>

      {/* Search Bar */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <SearchIcon sx={{ color: 'action.active', mt: 1 }} />
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search customers..."
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <React.Fragment key={customer.id}>
                <TableRow hover>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      component={Link}
                      to={`/edit-customer/${customer.id}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => deleteCustomer(customer.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => toggleExpand(customer.id)}>
                      {expanded[customer.id] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>

                {/* Expandable Details */}
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{ py: 0, borderBottom: 'none' }}
                  >
                    <Collapse in={expanded[customer.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          More Details
                        </Typography>
                        <Typography variant="body2"><b>Address:</b> {customer.address || 'N/A'}</Typography>
                        <Typography variant="body2"><b>Company:</b> {customer.company || 'N/A'}</Typography>
                        <Typography variant="body2"><b>Notes:</b> {customer.notes || 'No notes'}</Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CustomersList;
