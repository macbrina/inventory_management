"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { generateRandomColors } from "@/app/_util/utilities";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function DashboardChart({ productsByCategory }) {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [colors, setColors] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    if (productsByCategory && Object.keys(productsByCategory).length >= 0) {
      const categories = Object.keys(productsByCategory);
      const data = Object.values(productsByCategory);
      const colors = generateRandomColors(categories.length);

      setCategories(categories);
      setData(data);
      setColors(colors);
      setIsDataReady(true);
    }
  }, [productsByCategory]);

  if (!isDataReady) {
    return <div>Loading...</div>;
  }

  const options = {
    chart: {
      id: "dashboard-chart",
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: (val) => (Math.floor(val) === val ? val : ""),
      },
    },
    title: {
      text: "Products Added vs Categories",
      align: "center",
      style: {
        fontSize: "16px",
      },
    },
    plotOptions: {
      bar: {
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "20px",
        // colors: ["#000"],
      },
    },
    colors: colors,
  };

  const series = [
    {
      name: "Products",
      data: data,
    },
  ];

  return <Chart options={options} series={series} type="bar" height={320} />;
}

export default DashboardChart;
