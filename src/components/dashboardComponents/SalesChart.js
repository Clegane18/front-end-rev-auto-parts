import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { formatCurrency } from "../../utils/formatCurrency";
import "../../styles/dashboardComponents/SalesChart.css";

const SalesChart = ({ data }) => (
  <div id="root-sales-chart">
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" padding={{ right: 30 }} />
        <YAxis tickFormatter={formatCurrency} width={80} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
        <Line
          type="monotone"
          dataKey="grossIncome"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        >
          <LabelList
            dataKey="grossIncome"
            position="top"
            content={<PrintLabel />}
          />
        </Line>
        <Line type="monotone" dataKey="netIncome" stroke="#82ca9d">
          <LabelList
            dataKey="netIncome"
            position="top"
            content={<PrintLabel />}
          />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const PrintLabel = ({ x, y, value }) => {
  return (
    <text
      x={x}
      y={y}
      dy={-10}
      textAnchor="middle"
      fill="#000"
      className="print-label"
    >
      {formatCurrency(value)}
    </text>
  );
};

export default SalesChart;
