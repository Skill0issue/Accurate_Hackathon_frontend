import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { ChartData } from "@/components/chat/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ChartRenderer({ data }: { data: ChartData }) {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm w-full h-80">
      <Bar
        options={{ responsive: true, maintainAspectRatio: false }}
        data={data}
      />
    </div>
  );
}
