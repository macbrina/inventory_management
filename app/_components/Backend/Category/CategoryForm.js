"use client";

import {
  Button,
  Grid,
  IconButton,
  Input,
  Paper,
  Skeleton,
  TextField,
} from "@mui/material";
import { Add, Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import {
  addOrUpdateCategoryInFirestore,
  uploadImage,
} from "@/app/_lib/data-service";
import { useInventory } from "@/app/_context/InventoryContext";
import { toast } from "react-toastify";
import { generateUniqueId } from "@/app/_util/utilities";

function CategoryForm() {
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { user, loading: userLoading } = useAuth();
  const { updateCategoryList, state, dispatch } = useInventory();

  const toggleForm = () => setOpen(!open);

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

  const handleAddOrUpdateCategory = async (e) => {
    e.preventDefault();

    if (!newItem.name || newItem.name.trim() == "") {
      setErrors({ name: "Category name is required" });
      return;
    } else {
      setErrors({});
    }

    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImage(newItem.image);

      const itemData = {
        userId: user.uid,
        ...newItem,
        image: imageUrl,
        id: newItem.id || generateUniqueId(),
      };

      await addOrUpdateCategoryInFirestore(itemData, user, updateCategoryList);

      setNewItem({
        name: "",
        description: "",
        image: null,
      });

      document.getElementById("image").value = "";

      toggleForm();
      toast.success("Category added successfully.");
    } catch (error) {
      toast.error("Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dropdownElement = dropdownRef.current;
    if (open) {
      dropdownElement.style.maxHeight = `${dropdownElement.scrollHeight}px`;
    } else {
      dropdownElement.style.maxHeight = "0px";
    }
  }, [open, errors]);

  return (
    <>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <Button
          fullWidth
          type="button"
          variant="outlined"
          onClick={toggleForm}
          startIcon={<Add />}
          sx={{
            mt: 3,
            mb: 2,
            p: 3,
            width: {
              xs: "100%",
              sm: "200px",
              md: "200px",
              lg: "200px",
            },
          }}
        >
          Add Category
        </Button>
      </Grid>
      <Grid item xs={12}>
        {state.categoryLoading || userLoading ? (
          <Skeleton variant="rounded" width="100%" height="60px" />
        ) : (
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={state.categorySearch}
            onChange={(e) =>
              dispatch({ type: "SEARCH_CATEGORIES", payload: e.target.value })
            }
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        )}
      </Grid>
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
            label="Category Name"
            variant="outlined"
            name="name"
            fullWidth
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
        </Grid>
        <Grid item xs={12} md={6}>
          <Input
            type="file"
            label="(Optional)"
            fullWidth
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
          <TextField
            label="Description (Optional)"
            variant="outlined"
            name="description"
            fullWidth
            multiline
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddOrUpdateCategory}
            disabled={loading}
            sx={{
              "&.Mui-disabled": {
                color: "#fff",
                backgroundImage: "linear-gradient(to bottom, #646669, #B5B8BB)",
              },
            }}
          >
            {loading ? "Adding..." : " Add Category"}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default CategoryForm;
