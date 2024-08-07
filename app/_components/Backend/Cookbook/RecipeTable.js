import { useInventory } from "@/app/_context/InventoryContext";
import {
  fetchProductsByCategoryId,
  removeCategory,
  removeRecipe,
} from "@/app/_lib/data-service";
import { Search as SearchIcon, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import DeleteSvg from "../../Icons/DeleteSvg";
import EditSvg from "../../Icons/EditSvg";
import ViewRecipe from "./ViewRecipe";

function RecipeTable({ items, user }) {
  const { state, dispatch } = useInventory();
  const filteredItems = items.filter((item) =>
    item.recipeName.toLowerCase().includes(state.recipeSearch.toLowerCase())
  );

  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const { updateRecipeList } = useInventory();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    event.preventDefault();
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewClick = (item) => {
    setSelectedItem(item);
    setOpenViewModal(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    if (user.uid !== selectedItem.userId) {
      toast.error("You are not authorized to do this");
      return;
    }

    setLoading(() => true);

    try {
      await removeRecipe(selectedItem, user, updateRecipeList);

      setOpenDeleteModal(false);
      toast.success("Recipe deleted successfully");
    } catch (error) {
      setOpenDeleteModal(false);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        mb={2}
        display="flex"
        flexDirection="column"
        sx={{
          justifyContent: {
            xs: "center",
            sm: "center",
            md: "end",
            lg: "end",
          },
          alignItems: {
            xs: "center",
            sm: "center",
            md: "end",
            lg: "end",
          },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Search Recipe"
            variant="outlined"
            fullWidth
            value={state.recipeSearch}
            onChange={(e) =>
              dispatch({ type: "SET_RECIPE_SEARCH", payload: e.target.value })
            }
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Stack>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6">Recipe Name</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Source</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Date Created</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Action</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography variant="h5" padding={6}>
                  No Recipes found. Start Adding Some
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            filteredItems
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      {item.recipeName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      {item.source}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      {item.createdAt}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View">
                        <IconButton onClick={() => handleViewClick(item)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteClick(item)}>
                          <DeleteSvg />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedItem?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteModal(false)}
            disabled={loading}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundImage: loading
                ? "linear-gradient(to bottom, #646669, #B5B8BB);"
                : "",
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Recipe Modal */}
      <ViewRecipe
        openViewModal={openViewModal}
        setOpenViewModal={setOpenViewModal}
        recipe={selectedItem}
      />
    </>
  );
}

export default RecipeTable;
