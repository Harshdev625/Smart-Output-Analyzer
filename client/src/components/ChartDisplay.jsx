import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const ChartDisplay = ({ data }) => {
  if (!data || !data.values || !data.labels || data.values.length === 0) return null;

  const { chartType, labels, values, chartColor, title } = data;

  // Format large numbers
  const formatValue = (val) => {
    if (val >= 1e9) return (val / 1e9).toFixed(1) + "B";
    if (val >= 1e6) return (val / 1e6).toFixed(1) + "M";
    if (val >= 1e3) return (val / 1e3).toFixed(1) + "K";
    return val;
  };

  const formattedData = values.map((value, index) => ({
    name: labels[index] || `Data ${index + 1}`,
    value,
  }));

  const COLORS = [
    "#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6", "#F43F5E",
  ];

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatValue} />
              <Tooltip formatter={formatValue} />
              <Legend />
              <Bar dataKey="value">
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatValue} />
              <Tooltip formatter={formatValue} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColor || "#82ca9d"}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formattedData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${formatValue(entry.value)}`}
              >
                {formattedData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatValue} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <p className="text-gray-500 text-sm">Unsupported chart type</p>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-gray-700 mb-4">{title}</h3>
      {renderChart()}
    </div>
  );
};

export default ChartDisplay;
