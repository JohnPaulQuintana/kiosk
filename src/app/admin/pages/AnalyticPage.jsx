import React, { useEffect, useRef, useState } from "react";
import axios from "axios"; // Import Axios
import * as echarts from "echarts";

const AnalyticPage = () => {
  const chartRef = useRef(null);
  const [filter, setFilter] = useState("CurrentMonth");
  const [data, setData] = useState([]); // Store API data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const baseApiUrl = import.meta.env.VITE_API_URL_ANALYTICS;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(baseApiUrl); // Adjust API URL if needed
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "long" });

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);

    if (filter === "CurrentMonth") {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    } else {
      return date.toLocaleString("default", { month: "long" }) === filter;
    }
  });

  useEffect(() => {
    if (!data.length || loading || error) return;
  
    const chart = echarts.init(chartRef.current);
  
    // Handling xAxis labels to prevent overlap and ensure readability
    const axisLabels = filteredData.length > 0 
      ? filteredData.map((item) => `${item.room}`) 
      : ["No Data"];
  
    const option = {
      title: {
        text: `Most Visited Rooms by ${filter}`,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: axisLabels,
        axisLabel: {
          rotate: axisLabels.length > 10 ? 45 : 0, // Rotate only if there are too many labels
          interval: axisLabels.length > 10 ? Math.floor(axisLabels.length / 10) : 0, // Show only a subset of labels for large data
          fontSize: 12, // Adjust font size if needed
          formatter: function (value) {
            // Truncate long labels
            return value.length > 10 ? value.substring(0, 10) + "\n" + value.substring(10) : value;
          },
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Visits",
          type: "bar",
          data: filteredData.length > 0 ? filteredData.map((item) => item.visits) : [0],
          itemStyle: {
            color: "#5470c6",
          },
        },
      ],
    };
  
    // Set the chart options
    chart.setOption(option);
  
    // Clean up on component unmount
    return () => {
      chart.dispose();
    };
  }, [filter, filteredData]);
  

  return (
    <div className="flex">
      <div className="flex-1 bg-gray-100 p-4 h-[97vh] overflow-y-auto">
        <h1 className="text-2xl font-bold">Most Visited Units</h1>
        <p>Welcome to analytics Information!</p>

        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="mt-2 py-2">
              <div className="mt-4 py-2">
                <h1 className="text-xl font-semibold">Latest Activity</h1>
                <div className="mb-4">
                  <label htmlFor="filter" className="mr-2">
                    Filter by:
                  </label>
                  <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {/* <option value="thisMonth">{currentMonth}</option> */}
                    <option value="CurrentMonth">Current Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>
                <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticPage;
