"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { useInventory } from "@/app/_context/InventoryContext";
import {
  addOrUpdateCategoryInFirestore,
  addOrUpdateItemInFirestore,
  fetchUserCategories,
  uploadBase64Image,
  uploadImage,
} from "@/app/_lib/data-service";
import {
  formatDateIfValid,
  generateRandomImageName,
  generateUniqueId,
  getBase64,
  validateProductEntries,
} from "@/app/_util/utilities";
import {
  Add,
  Add as AddIcon,
  CameraAlt,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import CustomDatePicker from "../CustomDatePicker";
import { Camera } from "react-camera-pro";
import Image from "next/image";
import SpinnerMini from "../../SpinnerMini";
import GeneratedContent from "./GeneratedContent";
import { format } from "date-fns";

function CameraProductForm({ cameraUpload, toggleCameraForm }) {
  const { user } = useAuth();
  const dropCameraRef = useRef(null);
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
  const { state, updateProductList, updateCategoryList } = useInventory();

  const camera = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [base64Image, setBase64Image] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showCapturedImage, setShowCapturedImage] = useState(false);
  const [generatedNames, setGeneratedNames] = useState([]);
  const [generatedCategory, setGeneratedCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [showGeneratedCategory, setShowGeneratedCategory] = useState(false);

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

  const addNewCatgeory = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    setAddingCategory(true);
    try {
      const catId = generateUniqueId();
      const catData = {
        userId: user.uid,
        name: generatedCategory,
        id: catId,
      };

      await addOrUpdateCategoryInFirestore(catData, user, updateCategoryList);

      setNewItem((prevData) => ({
        ...prevData,
        category: generatedCategory,
        categoryId: catId,
      }));
      setShowGeneratedCategory(false);
      setGeneratedCategory("");
      toast.success("Category added successfully");
    } catch (error) {
      toast.error("Failed to add new category");
    } finally {
      setAddingCategory(false);
    }
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
      const imageName = generateRandomImageName();
      const imageUrl = await uploadBase64Image(base64Image, imageName);
      const createdAt = newItem.id
        ? newItem.createdAt
        : format(new Date(), "yyyy-MM-dd");

      const itemData = {
        userId: user.uid,
        ...newItem,
        image: imageUrl,
        id: newItem.id || generateUniqueId(),
        createdAt,
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

      toggleCameraForm();
      setShowCapturedImage(false);
      setBase64Image(null);
      setGeneratedNames([]);
      setShowCamera(false);
      toast.success("Item was successfully added");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dropdownElement = dropCameraRef.current;
    if (cameraUpload) {
      dropdownElement.style.maxHeight = `${
        dropdownElement.scrollHeight + 20
      }px`;
    } else {
      dropdownElement.style.maxHeight = "0px";
    }
  }, [cameraUpload, errors]);

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

  const toggleCamera = () => {
    setShowCamera((prev) => !prev);
    setShowCapturedImage(false);
    setBase64Image(null);
    setGeneratedNames([]);
    setShowGeneratedCategory(false);
  };

  const resetInputs = () => {
    setShowCapturedImage(false);
    setBase64Image(null);
    setGeneratedNames([]);
    setShowGeneratedCategory(false);
  };

  const handleCameraClose = () => setShowCamera(false);

  const handleNameChange = (e, itemName) => {
    e.preventDefault();
    setNewItem((prevData) => ({ ...prevData, name: itemName }));
  };

  const fillFormBasedOnClassification = (classification) => {
    setNewItem((prevData) => ({
      ...prevData,
      quantity: classification.quantity || prevData.quantity,
      expirationDate:
        formatDateIfValid(classification.expirationDate) ||
        prevData.expirationDate,
      brand: classification.brand || prevData.brand,
      notes: classification.notes || prevData.notes,
      purchaseDate:
        formatDateIfValid(classification.purchaseDate) || prevData.purchaseDate,
      location: classification.location || prevData.location,
    }));
  };

  const capture = async (e) => {
    e.preventDefault();

    if (showCamera) {
      let base64;
      setProcessing(true);
      try {
        base64 = await camera.current.takePhoto();

        if (!base64) {
          throw new Error("Failed to capture photo");
        }

        setShowCamera(false);
        setShowCapturedImage(true);
        setBase64Image(base64);

        const response = await fetch(`/api/product`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            base64Image: base64,
          }),
        });

        const data = await response.json();

        if (typeof data.content === "string") {
          const parsedContent = JSON.parse(data.content);
          setGeneratedNames(parsedContent.name);
          setGeneratedCategory(parsedContent.category);
          setShowGeneratedCategory(true);
          fillFormBasedOnClassification(parsedContent);
        } else {
          setGeneratedNames(data.content.name);
          setGeneratedCategory(data.content.category);
          setShowGeneratedCategory(true);
          fillFormBasedOnClassification(data.content);
        }
      } catch (error) {
        toast.error(error.message);
        resetInputs();
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 4,
        }}
      >
        <Stack direction="column" alignItems="center" spacing={2}>
          <Button
            fullWidth
            type="button"
            variant="outlined"
            onClick={toggleCamera}
            startIcon={<CameraAlt />}
            disabled={processing}
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
              "&.Mui-disabled": {
                color: "#fff",
                backgroundImage: "linear-gradient(to bottom, #646669, #B5B8BB)",
              },
            }}
          >
            {showCamera ? "Hide Camera" : "Capture Product"}
          </Button>

          <Dialog
            open={showCamera}
            onClose={handleCameraClose}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Take a Picture</DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "400px",
                  border: "1px solid #ddd",
                  overflow: "hidden",
                  backgroundColor: "#000",
                }}
              >
                <Camera
                  ref={camera}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCameraClose} color="primary">
                Close
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={capture}
                startIcon={<CameraAlt />}
              >
                Capture
              </Button>
            </DialogActions>
          </Dialog>
          {showCapturedImage && !showCamera && (
            <>
              <Typography variant="h6">Captured Image</Typography>
              <Avatar
                src={base64Image}
                alt="Taken Photo"
                sx={{
                  width: 200,
                  height: 200,
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </>
          )}
          {processing && (
            <Stack direction="row" spacing={1}>
              <Typography variant="body1">PROCESSING...</Typography>
              <CircularProgress color="inherit" size={20} />
            </Stack>
          )}
        </Stack>
      </Grid>
      <GeneratedContent
        generatedNames={generatedNames}
        addingCategory={addingCategory}
        handleNameChange={(e, itemName) => handleNameChange(e, itemName)}
        addNewCatgeory={addNewCatgeory}
        generatedCategory={generatedCategory}
        showGeneratedCategory={showGeneratedCategory}
      />

      <Grid
        ref={dropCameraRef}
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
            value={newItem.name}
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
        <Grid item xs={12} md={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={newItem.category}
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
            value={newItem.purchaseDate}
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
            value={newItem.expirationDate}
            onChange={handleInputChange}
            name="expirationDate"
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
            value={newItem.location}
            onChange={(e) =>
              setNewItem({ ...newItem, location: e.target.value })
            }
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

export default CameraProductForm;
