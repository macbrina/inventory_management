"use client";

import { useInventory } from "@/app/_context/InventoryContext";
import {
  addOrUpdateItemInFirestore,
  uploadImage,
} from "@/app/_lib/data-service";
import { validateProductEntries } from "@/app/_util/utilities";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomDatePicker from "../CustomDatePicker";

const ProductUpdateDialog = ({
  openUpdateModal,
  setOpenUpdateModal,
  selectedItem,
  user,
  updateProductList,
  updateCategoryList,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: 1,
    category: "",
    expirationDate: "",
    brand: "",
    notes: "",
    image: null,
    purchaseDate: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { state } = useInventory();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        toast.error("Only PNG and JPG files are allowed.");
        return;
      }

      if (file.size > 3 * 1024 * 1024) {
        toast.error("File size must be less than 3 MB.");
        return;
      }

      setFormData({ ...formData, image: file });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = state.categoryList.find(
      (category) => category.name === e.target.value
    );
    setFormData((prevData) => ({
      ...prevData,
      category: e.target.value,
      categoryId: selectedCategory.id,
    }));
  };

  const validateProductInputs = () => {
    const newErrors = validateProductEntries(formData);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateConfirm = async (e) => {
    e.preventDefault();

    if (!validateProductInputs()) {
      return;
    }

    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    if (user.uid !== selectedItem.userId) {
      toast.error("You are not authorized to do this");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      let imageUrl = selectedItem.image;

      if (formData.image && formData.image instanceof File) {
        imageUrl = await uploadImage(formData.image);
      }

      const itemData = {
        ...formData,
        image: imageUrl,
        id: selectedItem.id,
      };

      await addOrUpdateItemInFirestore(itemData, user, updateProductList);

      setFormData({
        name: "",
        quantity: 1,
        category: "",
        expirationDate: "",
        brand: "",
        notes: "",
        image: null,
        purchaseDate: "",
        location: "",
      });

      document.getElementById("image").value = "";
      setOpenUpdateModal(false);

      toast.success("Product was updated successfully");
    } catch (error) {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        name: selectedItem.name || "",
        quantity: selectedItem.quantity || 1,
        category: selectedItem.category || "",
        expirationDate: selectedItem.expirationDate || "",
        brand: selectedItem.brand || "",
        notes: selectedItem.notes || "",
        image: selectedItem.image || null,
        purchaseDate: selectedItem.purchaseDate || "",
        location: selectedItem.location || "",
      });
    }
  }, [selectedItem]);

  return (
    <Dialog open={openUpdateModal} onClose={() => setOpenUpdateModal(false)}>
      <DialogTitle>Update Item</DialogTitle>
      <DialogContent>
        <Typography>Update form for {selectedItem?.name}</Typography>
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Quantity"
              variant="outlined"
              type="number"
              fullWidth
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              inputProps={{ min: 1 }}
            />
            {errors.quantity && (
              <div style={{ color: "red" }}>{errors.quantity}</div>
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={handleCategoryChange}
                label="Category"
                sx={{
                  borderRadius: "10px",
                }}
              >
                {state.categoryList.map((category) => (
                  <MenuItem key={category.name} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.category && (
              <div style={{ color: "red" }}>{errors.category}</div>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomDatePicker
              label="Purchase Date"
              value={formData.purchaseDate}
              onChange={handleInputChange}
              name="purchaseDate"
            />
            {errors.purchaseDate && (
              <div style={{ color: "red" }}>{errors.purchaseDate}</div>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomDatePicker
              label="Expiration Date"
              value={formData.expirationDate}
              onChange={handleInputChange}
              name="expirationDate"
            />
            {errors.expirationDate && (
              <div style={{ color: "red" }}>{errors.expirationDate}</div>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Brand"
              variant="outlined"
              fullWidth
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input
              id="image"
              type="file"
              fullWidth
              inputProps={{ accept: "image/png, image/jpeg" }}
              onChange={handleImageChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {formData.image && formData.image instanceof File ? (
              <Avatar
                sx={{ m: 1 }}
                src={URL.createObjectURL(formData.image)}
                alt={formData.name}
              />
            ) : (
              formData.image && (
                <Avatar
                  sx={{ m: 1 }}
                  src={formData.image}
                  alt={formData.name}
                />
              )
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => setOpenUpdateModal(false)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdateConfirm}
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            backgroundImage: loading
              ? "linear-gradient(to bottom, #646669, #B5B8BB);"
              : "linear-gradient(to bottom, #0A66C2, #064079);",
          }}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductUpdateDialog;
