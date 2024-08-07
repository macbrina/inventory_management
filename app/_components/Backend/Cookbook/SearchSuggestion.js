import { useInventory } from "@/app/_context/InventoryContext";
import { addRecipeInFirestore, fetchUserItems } from "@/app/_lib/data-service";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

function SearchSuggestion({
  userLoading,
  showSuggestion,
  user,
  toggleSuggestion,
}) {
  const { state, updateRecipeList, updateProductList } = useInventory();
  const [options, setOptions] = useState(state.productList);
  const [searchValue, setSearchValue] = useState(options[0] || "");
  const dropSearchRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [newItem, setNewItem] = useState({
    pantryName: "",
    servings: 1,
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const memoizedProductListLength = useMemo(
    () => state.productList.length,
    [state.productList]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateSearchEntries = () => {
    const newErrors = {};

    if (!newItem.pantryName || newItem.pantryName.trim() == "") {
      newErrors.pantryName = "Please enter a search term.";
    }

    if (!newItem.servings || newItem.servings <= 0) {
      newErrors.servings = "Servings must be a positive integer.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveRecipe = async (recipe) => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const response = await fetch(`/api/youtubeurl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `${newItem.pantryName} recipe`,
        }),
      });

      const url = await response.json();

      const newRecipe = {
        ...recipe,
        userId: user.uid,
        productId: searchValue.id,
        youtubeUrl: url.content,
        source: "Pantry",
        createdAt: format(new Date(), "yyyy-MM-dd"),
      };

      await addRecipeInFirestore(user, newRecipe, updateRecipeList);

      setSearchLoading(false);
      setSearchValue("");
      setNewItem({ pantryName: "", servings: 1 });
      toggleSuggestion();
      toast.success("Recipe added successfully!");
    } catch (error) {
      throw error;
    }
  };

  const handleFetchSuggestions = async (e) => {
    e.preventDefault();

    if (!validateSearchEntries()) {
      return;
    }

    console.log(newItem.pantryName);
    console.log(state.productList);

    let filter;

    if (state.productList.length > 0) {
      filter = state.productList.some(
        (option) => option.name == newItem.pantryName
      );
    }

    if (!filter) {
      toast.error("Pantry name does not exist");
      return;
    }

    setErrors({});
    setSearchLoading(true);

    try {
      const response = await fetch(`/api/recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pantryName: newItem.pantryName,
          servings: newItem.servings,
        }),
      });

      const data = await response.json();

      await handleSaveRecipe(data.content);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await fetchUserItems(user, updateProductList);
        setOptions(
          products.map((product) => ({ id: product.id, name: product.name }))
        );
      } catch (error) {
        toast.error("Error fetching products:", error.message);
      }
    }
    if (memoizedProductListLength == 0 && user) {
      fetchProducts();
    }
  }, [user, memoizedProductListLength, updateProductList]);

  useEffect(() => {
    const dropdownElement = dropSearchRef.current;
    if (showSuggestion) {
      dropdownElement.style.maxHeight = `${
        dropdownElement.scrollHeight + 20
      }px`;
    } else {
      dropdownElement.style.maxHeight = "0px";
    }
  }, [showSuggestion, errors]);

  return (
    <Grid
      ref={dropSearchRef}
      container
      spacing={2}
      style={{ marginTop: 20, marginBottom: 20 }}
      sx={{
        overflow: "hidden",
        transition: "max-height 0.3s ease",
        marginLeft: "0px",
        alignItems: "center",
      }}
    >
      <Grid item xs={12} md={6}>
        {state.recipeLoading || userLoading ? (
          <Skeleton variant="rounded" width="100%" height="60px" />
        ) : (
          <>
            <Autocomplete
              freeSolo
              disableClearable
              disabled={searchLoading}
              options={options}
              getOptionLabel={(option) => option.name || ""}
              value={searchValue}
              onChange={(event, newValue) => {
                setSearchValue(newValue);
              }}
              inputValue={newItem.pantryName}
              onInputChange={(event, newInputValue) => {
                setNewItem((prevData) => ({
                  ...prevData,
                  pantryName: newInputValue,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Pantry"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searchLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {options.length === 0 && (
                          <span style={{ position: "absolute", right: "10px" }}>
                            No Products Available
                          </span>
                        )}
                      </>
                    ),
                  }}
                />
              )}
            />
            {errors.pantryName && (
              <div style={{ color: "red", marginTop: "8px" }}>
                {errors.pantryName}
              </div>
            )}
          </>
        )}
      </Grid>

      <Grid item xs={12} md={3}>
        {state.recipeLoading || userLoading ? (
          <Skeleton variant="rounded" width="100%" height="60px" />
        ) : (
          <TextField
            label="Servings"
            variant="outlined"
            type="number"
            fullWidth
            disabled={searchLoading}
            name="servings"
            value={newItem.servings}
            onChange={handleInputChange}
            InputProps={{
              inputProps: {
                min: 1,
              },
            }}
          />
        )}
        {errors.servings && (
          <div style={{ color: "red" }}>{errors.servings}</div>
        )}
      </Grid>
      <Grid item xs={12} md={3}>
        {state.recipeLoading || userLoading ? (
          <Skeleton variant="rounded" width="100%" height="60px" />
        ) : (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              variant="contained"
              disabled={searchLoading}
              onClick={handleFetchSuggestions}
              sx={{
                "&.Mui-disabled": {
                  color: "#fff",
                  backgroundImage:
                    "linear-gradient(to bottom, #646669, #B5B8BB)",
                },
              }}
            >
              {searchLoading ? "Generating... Please Wait" : "Generate"}
            </Button>
            {searchLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : null}
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}

export default SearchSuggestion;
