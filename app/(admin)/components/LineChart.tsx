import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart() {
  const options = {};

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Upper Bound",
        data: [100, 200, 300, 400, 500, 600, 700, 700, 750],
        borderColor: "purple",
        tension: 0.3,
      },
      {
        label: "Forecast",
        data: [150, 250, 360, 470, 560, 680, 760, 780, 760],
        borderColor: "blue",
        tension: 0.3,
      },
      {
        label: "Lower Bound",
        data: [110, 220, 330, 440, 550, 660, 770, 780, 790],
        borderColor: "cyan",
        backgroundColor: "pink",
        tension: 0.3,
      },
      {
        label: "Actual Sales",
        data: [130, 230, 340, 460, 560, 640, 770, 740, 780],
        borderColor: "violet",
        backgroundColor: "pink",
        tension: 0.3,
      },
    ],
  };

  return (
    <div>
      <Line options={options} data={data} />
    </div>
  );
}
