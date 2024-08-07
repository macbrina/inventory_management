"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";

const ViewProduct = ({ openViewModal, setOpenViewModal, product }) => {
  return (
    <Dialog
      open={openViewModal}
      onClose={() => setOpenViewModal(false)}
      PaperProps={{
        style: {
          width: "70%",
          maxWidth: "none",
        },
      }}
    >
      <DialogTitle>
        {product?.name} - Created Date: {product?.createdAt}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              <strong>Name:</strong> {product.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              <strong>Brand:</strong> {product.brand}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              <strong>Category:</strong> {product.category}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              <strong>Quantity:</strong> {product.quantity}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              <strong>Purchase Date:</strong> {product.purchaseDate}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              <strong>Expiration Date:</strong> {product.expirationDate}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              <strong>Location:</strong> {product.location}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              <strong>Notes:</strong> {product.notes}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => setOpenViewModal(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewProduct;
