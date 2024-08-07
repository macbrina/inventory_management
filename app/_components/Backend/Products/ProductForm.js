"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { useInventory } from "@/app/_context/InventoryContext";
import {
  addOrUpdateItemInFirestore,
  fetchUserCategories,
  uploadImage,
} from "@/app/_lib/data-service";
import {
  generateUniqueId,
  validateProductEntries,
} from "@/app/_util/utilities";
import { Add, Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import CustomDatePicker from "../CustomDatePicker";
import { format } from "date-fns";

function ProductForm({ normalUpload, toggleNormalForm }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({
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
  const { state, dispatch, updateProductList, updateCategoryList } =
    useInventory();

  const handleFileChange = (e) => {
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

      setNewItem({ ...newItem, image: file });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = state.categoryList.find(
      (category) => category.name === e.target.value
    );
    setNewItem((prevData) => ({
      ...prevData,
      category: e.target.value,
      categoryId: selectedCategory.id,
    }));
  };

  const validateProductInputs = () => {
    const newErrors = validateProductEntries(newItem);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrUpdateItem = async (e) => {
    e.preventDefault();

    if (!validateProductInputs()) {
      return;
    }

    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const imageUrl = await uploadImage(newItem.image);

      const itemData = {
        userId: user.uid,
        ...newItem,
        image: imageUrl,
        id: newItem.id || generateUniqueId(),
        createdAt: format(new Date(), "yyyy-MM-dd"),
      };

      await addOrUpdateItemInFirestore(
        itemData,
        user,
        updateProductList,
        updateCategoryList
      );
      setNewItem({
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

      toggleNormalForm();
      toast.success("Item was successfully added");
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dropdownElement = dropdownRef.current;
    if (normalUpload) {
      dropdownElement.style.maxHeight = `${
        dropdownElement.scrollHeight + 20
      }px`;
    } else {
      dropdownElement.style.maxHeight = "0px";
    }
  }, [normalUpload, errors]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        await fetchUserCategories(user, updateCategoryList);
      } catch (error) {
        toast.error("Error fetching categories:", error);
      }
    }

    if (user) {
      fetchCategories();
    }
  }, [user, updateCategoryList]);

  useEffect(() => {
    if (state.categoryList && state.categoryList.length === 0) {
      setErrors({ category: "No category found. Add some first" });
    } else {
      setErrors({});
    }
  }, [state.categoryList]);

  return (
    <>
      <Grid
        ref={dropdownRef}
        container
        spacing={2}
        style={{ marginTop: 20, marginBottom: 20 }}
        sx={{
          overflow: "hidden",
          transition: "max-height 0.3s ease",
          marginLeft: "0px",
        }}
      >
        <Grid item xs={12} md={6}>
          <TextField
            label="Item Name"
            name="name"
            variant="outlined"
            fullWidth
            disabled={loading}
            value={newItem.name}
            onChange={handleInputChange}
          />
          {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Quantity"
            variant="outlined"
            type="number"
            fullWidth
            name="quantity"
            disabled={loading}
            value={newItem.quantity}
            onChange={handleInputChange}
            InputProps={{
              inputProps: {
                min: 1,
              },
            }}
          />
          {errors.quantity && (
            <div style={{ color: "red" }}>{errors.quantity}</div>
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={newItem.category}
              onChange={handleCategoryChange}
              disabled={loading}
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
            value={newItem.purchaseDate}
            onChange={handleInputChange}
            name="purchaseDate"
            loading={loading}
          />
          {errors.purchaseDate && (
            <div style={{ color: "red" }}>{errors.purchaseDate}</div>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomDatePicker
            label="Expiration Date"
            value={newItem.expirationDate}
            onChange={handleInputChange}
            name="expirationDate"
            loading={loading}
          />
          {errors.expirationDate && (
            <div style={{ color: "red" }}>{errors.expirationDate}</div>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Brand (Optional)"
            variant="outlined"
            name="brand"
            fullWidth
            disabled={loading}
            value={newItem.brand}
            onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Notes (Optional)"
            variant="outlined"
            name="notes"
            fullWidth
            multiline
            disabled={loading}
            value={newItem.notes}
            onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Location (Optional)"
            variant="outlined"
            name="location"
            fullWidth
            disabled={loading}
            value={newItem.location}
            onChange={(e) =>
              setNewItem({ ...newItem, location: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            type="file"
            label="(Optional)"
            fullWidth
            disabled={loading}
            id="image"
            name="image"
            inputProps={{ accept: "image/*" }}
            onChange={handleFileChange}
            sx={{
              minHeight: "55px",
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            // color="primary"
            startIcon={!loading ? <AddIcon /> : null}
            onClick={handleAddOrUpdateItem}
            disabled={loading}
            sx={{
              "&.Mui-disabled": {
                color: "#fff",
                backgroundImage: "linear-gradient(to bottom, #646669, #B5B8BB)",
              },
            }}
          >
            {loading ? "Adding..." : "Add Item"}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default ProductForm;
