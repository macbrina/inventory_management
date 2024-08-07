import {
  Avatar,
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
  Tooltip,
  Typography,
} from "@mui/material";
import Title from "../../Title";
import { useInventory } from "@/app/_context/InventoryContext";
import { useState } from "react";
import EditSvg from "../../Icons/EditSvg";
import DeleteSvg from "../../Icons/DeleteSvg";
import {
  fetchProductsByCategoryId,
  removeCategory,
} from "@/app/_lib/data-service";
import { toast } from "react-toastify";
import CategoryUpdateDialog from "./CategoryUpdateDialog";

function CategoryTable({ items, user }) {
  const { state } = useInventory();
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(state.categorySearch.toLowerCase())
  );

  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { updateCategoryList } = useInventory();

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

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOpenDeleteModal(true);
  };

  const handleUpdateClick = (item) => {
    setSelectedItem(item);
    setOpenUpdateModal(true);
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
      const products = await fetchProductsByCategoryId(selectedItem.id);

      if (products.length > 0) {
        toast.error("Cannot delete category with associated products.");
        setOpenDeleteModal(false);
        return;
      }

      await removeCategory(selectedItem, user, updateCategoryList);

      setOpenDeleteModal(false);
      toast.success("Category deleted successfully");
    } catch (error) {
      setOpenDeleteModal(false);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Title>Categories</Title> */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6">Category</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Product Count</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Description</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Created Date</Typography>
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
                  No Categories found. Start Adding Some
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            filteredItems
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Stack direction="row" alignItems="center">
                      <Typography variant="body1" sx={{ fontSize: "16px" }}>
                        {item.name}
                      </Typography>
                      {item.image && (
                        <Avatar
                          sx={{ m: 1 }}
                          src={item.image}
                          alt={item.name}
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      {item.productCount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      {item.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      {item.createdAt}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleUpdateClick(item)}>
                          <EditSvg />
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

      {/* Update Modal */}
      <CategoryUpdateDialog
        openUpdateModal={openUpdateModal}
        setOpenUpdateModal={setOpenUpdateModal}
        selectedItem={selectedItem}
        user={user}
        updateCategoryList={updateCategoryList}
      />
    </>
  );
}

export default CategoryTable;
