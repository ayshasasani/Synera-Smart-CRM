// src/components/Products.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import { toast } from "react-toastify";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

const Products = () => {
  const { user, loading } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // ---------------- Fetch products ----------------
  const fetchProducts = async () => {
    try {
      const response = await API.get("products/");
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  // ---------------- Search ----------------
  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredProducts(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            (p.description && p.description.toLowerCase().includes(term))
        )
      );
    }
  }, [searchTerm, products]);

  // ---------------- Form change handler ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------- Open dialog ----------------
  const handleOpen = (product = null) => {
    setEditingProduct(product);
    if (product) setFormData(product);
    else setFormData({ name: "", description: "", price: "", stock: "" });
    setOpen(true);
  };

  // ---------------- Close dialog ----------------
  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
  };

  // ---------------- Save (create/update) product ----------------
  const handleSave = async () => {
    try {
      if (editingProduct) {
        await API.put(`products/${editingProduct.id}/`, formData);
        toast.success("Product updated successfully");
      } else {
        await API.post("products/", formData);
        toast.success("Product added successfully");
      }
      fetchProducts();
      handleClose();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error("Failed to save product");
    }
  };

  // ---------------- Delete product ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`products/${id}/`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      {/* Search & Add */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          placeholder="Search products..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Product
        </Button>
      </Box>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell><b>Stock</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>LKR {product.price.toLocaleString()}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(product)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Product Name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price (LKR)"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="stock"
            label="Stock"
            type="number"
            fullWidth
            value={formData.stock}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingProduct ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
