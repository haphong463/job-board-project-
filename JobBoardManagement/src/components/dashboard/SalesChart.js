import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import axiosRequest from "../../configs/axiosConfig";

const SalesChart = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "User Registrations",
        data: [], // This will hold the registration counts
      },
    ],
    options: {
      chart: {
        type: "bar",
      },
      xaxis: {
        categories: [], // This will hold the months
      },
    },
  });

  const fetchData = async () => {
    try {
      const data = await axiosRequest.get("/user/registration-count/year", {
        params: { year },
      });

      // Assuming the data returned is in the form of an array of { month: 'JANUARY', count: number }
      const categories = data.map((item) => item.month);
      const seriesData = data.map((item) => item.count);

      setChartData({
        series: [
          {
            name: "User Registrations",
            data: seriesData,
          },
        ],
        options: {
          ...chartData.options,
          xaxis: {
            categories: categories,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">User Registration Summary</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Monthly user registrations for {year}
        </CardSubtitle>
        <div className="d-flex align-items-center">
          <FormGroup>
            <Label for="yearInput">Select Year:</Label>
            <Input
              id="yearInput"
              type="number"
              value={year}
              onChange={handleYearChange}
              min="2000"
              max={new Date().getFullYear()}
              placeholder="Enter year"
            />
          </FormGroup>
          <Button color="primary" onClick={fetchData} className="mt-3">
            Fetch Data
          </Button>
        </div>
        <div className="mt-4">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="area"
            height="350"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default SalesChart;
