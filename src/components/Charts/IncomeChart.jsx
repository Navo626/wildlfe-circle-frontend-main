import Chart from "react-apexcharts";
import { useTheme } from "../../hooks/ThemeProvider.jsx";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios.jsx";

const IncomeChart = () => {
  const { currentTheme } = useTheme();
  const [income, setIncome] = useState({});
  const axiosInstance = useAxios();

  useEffect(() => {
    axiosInstance
      .get("/api/admin/dashboard/income")
      .then((response) => {
        if (response.data.status === true) {
          setIncome(response.data.data);
        } else {
          console.error("Failed to fetch income");
        }
      })
      .catch((error) => {
        console.error("An error occurred!", error);
      });
  }, []);

  const state = {
    options: {
      chart: {
        id: "income-chart",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: false,
            zoomin: true,
            zoomout: true,
            pan: false,
          },
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {
          style: {
            colors: currentTheme === "dark" ? "#f3f4f6" : "#333",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: currentTheme === "dark" ? "#f3f4f6" : "#333",
          },
        },
      },
      colors: ["#22c55e"],
      stroke: {
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      title: {
        text: "Income",
        align: "left",
        style: {
          fontSize: "16px",
          color: currentTheme === "dark" ? "#f3f4f6" : "#333",
        },
      },
      grid: {
        row: {
          colors: ["transparent", "transparent"],
          opacity: 0.5,
        },
      },
      markers: {
        size: 6,
      },
    },
    series: [
      {
        name: income.name || "Rs",
        data: income.data || [],
      },
    ],
  };

  return (
    <div className="w-full">
      <Chart options={state.options} series={state.series} type="area" />
    </div>
  );
};

export default IncomeChart;
