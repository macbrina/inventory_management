"use client";

import { useAuth } from "@/app/_context/AuthContext";
import { Box, Skeleton, Stack, Typography } from "@mui/material";

import DashboardChart from "@/app/_components/Backend/Dashboard/DashboardChart";
import GridCard from "@/app/_components/Backend/Dashboard/GridCard";
import GridItem from "@/app/_components/Backend/Dashboard/GridItem";
import { firestore } from "@/app/_firebase/config";
import { getGreeting } from "@/app/_util/utilities";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { isBefore, parseISO } from "date-fns";
import { collection, getDocs, query, where } from "firebase/firestore";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Account() {
  const { user, loading } = useAuth();
  const [loadData, setLoadData] = useState(false);
  const greeting = getGreeting();
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [lowStockAlerts, setLowStockAlerts] = useState(0);
  const [expiredProducts, setExpiredProducts] = useState(0);
  const [productsByCategory, setProductsByCategory] = useState({});

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoadData(true);
      try {
        const productsQuery = query(
          collection(firestore, "products"),
          where("userId", "==", user.uid)
        );

        const productsSnapshot = await getDocs(productsQuery);
        setTotalProducts(productsSnapshot.size);

        let itemsCount = 0;
        let lowStockCount = 0;
        let expiredCount = 0;
        const currentDate = new Date();

        productsSnapshot.forEach((doc) => {
          const productData = doc.data();

          itemsCount += +productData.quantity || 0;

          // Check for low stock
          if (productData.quantity <= 5) {
            lowStockCount += 1;
          }

          // Check for expired products
          const expirationDate = parseISO(productData.expirationDate);
          if (isBefore(expirationDate, currentDate)) {
            expiredCount += 1;
          }
        });

        setTotalItems(itemsCount);
        setLowStockAlerts(lowStockCount);
        setExpiredProducts(expiredCount);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadData(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchChartData = async () => {
      setLoadData(true);
      try {
        const productsQuery = query(
          collection(firestore, "products"),
          where("userId", "==", user.uid)
        );

        const productsSnapshot = await getDocs(productsQuery);

        const categoryCounts = {};

        productsSnapshot.forEach((doc) => {
          const productData = doc.data();
          const category = productData.category || "Uncategorized";

          if (!categoryCounts[category]) {
            categoryCounts[category] = 0;
          }
          categoryCounts[category] += 1;
        });

        setProductsByCategory(categoryCounts);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoadData(false);
      }
    };

    fetchChartData();
  }, [user]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta
          name="description"
          content="Monitor and manage your activities with the dashboard."
        />
        <meta name="keywords" content="dashboard, analytics, management" />
      </Head>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#fff"
                  : theme.palette.grey[900],
              boxShadow: "none",
            }}
          >
            <Box>
              {loading ? (
                <Skeleton variant="rectangular" width={210} height={60} />
              ) : (
                <Typography variant="h5">
                  Hi {user?.fullname?.split(" ")[0]}, {greeting}
                </Typography>
              )}
              <Typography variant="body1" sx={{ mt: 3 }}>
                View key metrics and insights for your pantry.
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          lg={8}
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexDirection: {
              xs: "column",
              sm: "column",
              md: "row",
              lg: "row",
            },
          }}
        >
          <GridCard loading={loading} loadData={loadData}>
            <GridItem
              imgUrl="/images/box.png"
              total={totalProducts}
              title="Total Products"
            />
          </GridCard>
          <GridCard loading={loading} loadData={loadData}>
            <GridItem
              imgUrl="/images/list-items.png"
              total={totalItems}
              title="Total Items"
            />
          </GridCard>
          <GridCard loading={loading} loadData={loadData}>
            <GridItem
              imgUrl="/images/low.png"
              total={lowStockAlerts}
              title="Low Stock Alerts"
            />
          </GridCard>
          <GridCard loading={loading} loadData={loadData}>
            <GridItem
              imgUrl="/images/expired.png"
              total={expiredProducts}
              title="Expired Products"
            />
          </GridCard>
        </Grid>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#fff"
                  : theme.palette.grey[900],
              backgroundImage: (theme) =>
                theme.palette.mode === "light"
                  ? `none`
                  : "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
              boxShadow: "rgba(3, 102, 214, 0.3) 0px 0px 0px 2px",
            }}
          >
            {loading || loadData || !user ? (
              <Skeleton
                variant="rounded"
                animation="wave"
                width="100%"
                height="100px"
              />
            ) : (
              <DashboardChart productsByCategory={productsByCategory} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default Account;
