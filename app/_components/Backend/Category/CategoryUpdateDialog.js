"use client";

import { useInventory } from "@/app/_context/InventoryContext";
import {
  addOrUpdateCategoryInFirestore,
  uploadImage,
} from "@/app/_lib/data-service";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function CategoryUpdateDialog({
  openUpdateModal,
  setOpenUpdateModal,
  selectedItem,
  user,
  updateCategoryList,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
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

  const handleUpdateConfirm = async (e) => {
    e.preventDefault();

    if (!formData.name || formData.name.trim() == "") {
      setErrors({ name: "Category name is required" });
      return;
    } else {
      setErrors({});
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

      await addOrUpdateCategoryInFirestore(itemData, user, updateCategoryList);

      setFormData({
        name: "",
        description: "",
        image: null,
      });

      document.getElementById("image").value = "";
      setOpenUpdateModal(false);
      toast.success("Category added successfully.");
    } catch (error) {
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        name: selectedItem.name || "",
        description: selectedItem.description || "",
        image: selectedItem.image || null,
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              name="description"
              fullWidth
              multiline
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
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
}

export default CategoryUpdateDialog;
