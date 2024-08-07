"use client";

import DeleteSvg from "@/app/_components/Icons/DeleteSvg";
import EditSvg from "@/app/_components/Icons/EditSvg";
import Title from "@/app/_components/Title";
import { useInventory } from "@/app/_context/InventoryContext";
import { removeProduct } from "@/app/_lib/data-service";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { toast } from "react-toastify";
import ProductUpdateDialog from "./ProductUpdateDialog";

const filters = {
  all: "All",
  name: "Name",
  brand: "Brand",
  quantity: "Quantity",
  category: "Category",
  purchaseDate: "Purchase Date",
  expirationDate: "Expiration Date",
  location: "Location",
};
function ProductTable({ items, user }) {
  const { state, updateProductList, updateCategoryList } = useInventory();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filter, setFilter] = useState("all");

  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    event.preventDefault();
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const filteredItems = items
  //   .filter((item) =>
  //     item.name.toLowerCase().includes(state.productSearch.toLowerCase())
  //   )
  //   .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

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
      await removeProduct(selectedItem, user, updateProductList);

      setOpenDeleteModal(false);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items
    .filter((item) =>
      item.name.toLowerCase().includes(state.productSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (filter === "all") {
        return new Date(b.purchaseDate) - new Date(a.purchaseDate);
      }
      if (filter === "name") {
        return a.name.localeCompare(b.name);
      }
      if (filter === "brand") {
        return a.brand.localeCompare(b.brand);
      }
      if (filter === "quantity") {
        return a.quantity - b.quantity;
      }
      if (filter === "category") {
        return a.category.localeCompare(b.category);
      }
      if (filter === "purchaseDate") {
        return new Date(b.purchaseDate) - new Date(a.purchaseDate);
      }
      if (filter === "expirationDate") {
        return new Date(b.expirationDate) - new Date(a.expirationDate);
      }
      if (filter === "location") {
        return a.location.localeCompare(b.location);
      }
      return 0;
    });

  return (
    <>
      {/* <Title>Inventory</Title> */}
      <Box
        mb={2}
        display="flex"
        flexDirection="column"
        justifyContent="end"
        alignItems="end"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6">Filter By:</Typography>
          <FormControl variant="outlined">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{
                borderRadius: "10px",
              }}
            >
              {Object.entries(filters).map(([key, name]) => (
                <MenuItem key={key} value={key}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow
            sx={{
              borderBottom: "1px solid rgba(3, 102, 214, 0.3)",
            }}
          >
            <TableCell>
              <Typography variant="h6">Product</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Brand</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Category</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Quantity</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Expires</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Purchased</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Location</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Notes</Typography>
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
                  No products found. Start Adding Some
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            filteredItems
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
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
                    </Box>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      {item.brand}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      {item.category}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      {item.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      {item.expirationDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      {item.purchaseDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      {item.location}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Typography variant="body1" sx={{ fontSize: "16px" }}>
                      {item.notes}
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
      <ProductUpdateDialog
        openUpdateModal={openUpdateModal}
        setOpenUpdateModal={setOpenUpdateModal}
        selectedItem={selectedItem}
        user={user}
        updateProductList={updateProductList}
        updateCategoryList={updateCategoryList}
      />
    </>
  );
}

export default ProductTable;
