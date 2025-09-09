import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Map,
  Grid3X3,
  X,
  Zap,
  Leaf,
  Activity,
  Target,
  ArrowUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Pie,
} from "recharts";

const sampleKPIData = [
  { title: "Total Projects", value: "48", change: "+8.2%", trend: "up" },
  {
    title: "Energy Generated",
    value: "2.4 GWh",
    change: "+12.5%",
    trend: "up",
  },
  { title: "Active Teams", value: "12", change: "+2", trend: "up" },
  { title: "System Efficiency", value: "94.2%", change: "+1.8%", trend: "up" },
];

const sampleDonutData = [
  { name: "Completed", value: 35, color: "#10b981" },
  { name: "In Progress", value: 25, color: "#3b82f6" },
  { name: "On Hold", value: 15, color: "#f59e0b" },
  { name: "Cancelled", value: 10, color: "#ef4444" },
];

const sampleTrendData = [
  { month: "Jan", revenue: 12000, projects: 8 },
  { month: "Feb", revenue: 15000, projects: 12 },
  { month: "Mar", revenue: 18000, projects: 15 },
  { month: "Apr", revenue: 22000, projects: 18 },
  { month: "May", revenue: 25000, projects: 22 },
  { month: "Jun", revenue: 28000, projects: 25 },
];

const sampleTableData = [
  {
    id: 1,
    project: "Solar Installation A",
    client: "Green Energy Corp",
    status: "Active",
    budget: "$45,000",
    progress: 85,
  },
  {
    id: 2,
    project: "Wind Farm Design",
    client: "Eco Solutions",
    status: "Review",
    budget: "$120,000",
    progress: 60,
  },
  {
    id: 3,
    project: "Battery Storage",
    client: "Power Tech",
    status: "Completed",
    budget: "$85,000",
    progress: 100,
  },
  {
    id: 4,
    project: "Grid Integration",
    client: "Smart Grid Inc",
    status: "Planning",
    budget: "$95,000",
    progress: 25,
  },
];

const sampleBarData = [
  { category: "Solar", value: 45 },
  { category: "Wind", value: 32 },
  { category: "Hydro", value: 28 },
  { category: "Battery", value: 22 },
  { category: "Grid", value: 18 },
];

const sampleCalendarEvents = [
  { date: "2025-01-07", title: "Project Review Meeting", type: "meeting" },
  { date: "2025-01-08", title: "Client Presentation", type: "presentation" },
  { date: "2025-01-09", title: "Installation Deadline", type: "deadline" },
  { date: "2025-01-10", title: "Team Workshop", type: "workshop" },
];

export interface DashboardComponentProps {
  id: string;
  onRemove?: (id: string) => void;
}

export const KPIComponent: React.FC<DashboardComponentProps> = ({
  id,
  onRemove,
}) => (
  <Card className="col-span-full min-h-[300px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Key Performance Indicators
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Real-time business metrics
            </p>
          </div>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardTitle>
    </CardHeader>

    <CardContent className="p-6 pt-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sampleKPIData.map((kpi, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg hover:shadow-sm transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`p-2 rounded-md ${
                  index === 0
                    ? "bg-blue-100 dark:bg-blue-900/50"
                    : index === 1
                      ? "bg-yellow-100 dark:bg-yellow-900/50"
                      : index === 2
                        ? "bg-green-100 dark:bg-green-900/50"
                        : "bg-purple-100 dark:bg-purple-900/50"
                }`}
              >
                {index === 0 && (
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                )}
                {index === 1 && (
                  <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                )}
                {index === 2 && (
                  <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
                {index === 3 && (
                  <Leaf className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ArrowUp className="w-3 h-3" />
                <span className="text-xs font-medium">{kpi.change}</span>
              </div>
            </div>

            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {kpi.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {kpi.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const DonutComponent: React.FC<DashboardComponentProps> = ({
  id,
  onRemove,
}) => (
  <Card className="col-span-full md:col-span-2 lg:col-span-1 min-h-[400px] bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900 border-0 shadow-lg rounded-2xl transition-all duration-500 hover:shadow-xl">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Project Status
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Distribution overview
            </p>
          </div>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <div className="relative mb-6">
        <ResponsiveContainer width="100%" height={240}>
          <RechartsPieChart>
            <Pie
              data={sampleDonutData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              strokeWidth={3}
              stroke="var(--background)"
            >
              {sampleDonutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                color: "#374151",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              85
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Projects
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {sampleDonutData.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="flex-1">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {item.name}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const TrendLineComponent: React.FC<DashboardComponentProps> = ({
  id,
  onRemove,
}) => (
  <Card className="col-span-full lg:col-span-3 min-h-[400px] bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-900 border-0 shadow-lg rounded-2xl transition-all duration-500 hover:shadow-xl">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Performance Trends
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Revenue & project growth
            </p>
          </div>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
          <p className="text-sm opacity-90">Total Revenue</p>
          <p className="text-2xl font-bold">$28,000</p>
          <p className="text-xs opacity-75">+18.2% from last month</p>
        </div>
        <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white">
          <p className="text-sm opacity-90">Active Projects</p>
          <p className="text-2xl font-bold">25</p>
          <p className="text-xs opacity-75">+4 new this month</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={sampleTrendData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--muted-foreground) / 0.2)"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              color: "#374151",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#10b981" }}
          />
          <Line
            type="monotone"
            dataKey="projects"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#3b82f6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const TableComponent: React.FC<DashboardComponentProps> = ({
  id,
  onRemove,
}) => (
  <Card className="col-span-full min-h-[500px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-lg rounded-2xl transition-all duration-500 hover:shadow-xl">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
            <Grid3X3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Projects Overview
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Detailed project information
            </p>
          </div>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Project
              </th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Client
              </th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Status
              </th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Progress
              </th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Budget
              </th>
            </tr>
          </thead>
          <tbody>
            {sampleTableData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="p-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {row.project}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {row.id}
                    </p>
                  </div>
                </td>
                <td className="p-4 text-gray-700 dark:text-gray-300 font-medium">
                  {row.client}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      row.status === "Active"
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : row.status === "Review"
                          ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                          : row.status === "Completed"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            : "bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${row.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-10">
                      {row.progress}%
                    </span>
                  </div>
                </td>
                <td className="p-4 font-bold text-gray-900 dark:text-white">
                  {row.budget}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export const BarComponent: React.FC<DashboardComponentProps> = ({
  id,
  onRemove,
}) => (
  <Card className="col-span-full md:col-span-2 lg:col-span-1 min-h-[400px] bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-orange-900 border-0 shadow-lg rounded-2xl transition-all duration-500 hover:shadow-xl">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Energy Sources
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Distribution by type
            </p>
          </div>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={sampleBarData}
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--muted-foreground) / 0.2)"
          />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <YAxis
            dataKey="category"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            width={60}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              color: "#374151",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
          />
          <Bar dataKey="value" fill="#f97316" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const MapComponent: React.FC<DashboardComponentProps> = ({
  id,
  onRemove,
}) => (
  <Card className="col-span-full md:col-span-2 lg:col-span-1 min-h-[400px] bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-900 border-0 shadow-lg rounded-2xl transition-all duration-500 hover:shadow-xl">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Project Locations
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Global distribution
            </p>
          </div>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <div className="h-72 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-800 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-300 dark:border-blue-600">
        <div className="text-center">
          <Map className="w-16 h-16 mx-auto mb-4 text-blue-500 dark:text-blue-400" />
          <p className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
            Interactive Map View
          </p>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-3 inline-block">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              25 Active Locations
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Across 12 Countries
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const CalendarListComponent: React.FC<DashboardComponentProps> = ({
  id,
  onRemove,
}) => (
  <Card className="col-span-full md:col-span-2 lg:col-span-1 min-h-[400px] bg-gradient-to-br from-white to-pink-50 dark:from-gray-900 dark:to-pink-900 border-0 shadow-lg rounded-2xl transition-all duration-500 hover:shadow-xl">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Upcoming Events
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Schedule overview
            </p>
          </div>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <div className="space-y-4">
        {sampleCalendarEvents.map((event, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-md transition-all duration-300"
          >
            <div
              className={`w-4 h-4 rounded-full ${
                event.type === "meeting"
                  ? "bg-blue-500"
                  : event.type === "presentation"
                    ? "bg-green-500"
                    : event.type === "deadline"
                      ? "bg-red-500"
                      : "bg-purple-500"
              }`}
            ></div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {event.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {event.date}
              </p>
            </div>
            <div
              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                event.type === "meeting"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  : event.type === "presentation"
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : event.type === "deadline"
                      ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      : "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
              }`}
            >
              {event.type}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const ProgressBarComponent: React.FC<DashboardComponentProps> = ({
  id,
  onRemove,
}) => (
  <Card className="col-span-full min-h-[500px] bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900 border-0 shadow-lg rounded-2xl transition-all duration-500 hover:shadow-xl">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Project Progress
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Current development status
            </p>
          </div>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <div className="space-y-6">
        {[
          {
            name: "Solar Installation Alpha",
            progress: 85,
            category: "Installation",
            color: "from-green-400 to-green-600",
          },
          {
            name: "Wind Farm Design Beta",
            progress: 60,
            category: "Design",
            color: "from-blue-400 to-blue-600",
          },
          {
            name: "Battery Storage Gamma",
            progress: 95,
            category: "Storage",
            color: "from-purple-400 to-purple-600",
          },
          {
            name: "Grid Integration Delta",
            progress: 40,
            category: "Integration",
            color: "from-orange-400 to-orange-600",
          },
        ].map((project, index) => (
          <div
            key={index}
            className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                  {project.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {project.category}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {project.progress}%
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Complete
                </p>
              </div>
            </div>
            <div className="relative">
              <Progress
                value={project.progress}
                className="h-3 bg-gray-200 dark:bg-gray-600"
              />
              <div
                className={`absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r ${project.color} transition-all duration-500`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const CalendarCardComponent: React.FC<DashboardComponentProps> = ({
  id,
  onRemove,
}) => (
  <Card className="col-span-full md:col-span-2 lg:col-span-1 min-h-[400px] bg-gradient-to-br from-white to-cyan-50 dark:from-gray-900 dark:to-cyan-900 border-0 shadow-lg rounded-2xl transition-all duration-500 hover:shadow-xl">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Calendar View
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              January 2025
            </p>
          </div>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-3">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
          <div
            key={day}
            className={`p-2 text-center text-sm rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 font-medium ${
              [7, 15, 23].includes(day)
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
          3 events scheduled this month
        </p>
      </div>
    </CardContent>
  </Card>
);

export const ColumnComponent: React.FC<DashboardComponentProps> = ({
  id,
  onRemove,
}) => (
  <Card className="col-span-full md:col-span-2 lg:col-span-1 min-h-[400px] bg-gradient-to-br from-white to-violet-50 dark:from-gray-900 dark:to-violet-900 border-0 shadow-lg rounded-2xl transition-all duration-500 hover:shadow-xl">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Monthly Performance
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Performance metrics
            </p>
          </div>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={sampleBarData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--muted-foreground) / 0.2)"
          />
          <XAxis
            dataKey="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              color: "#374151",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
          />
          <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const ChoroplethMapComponent: React.FC<DashboardComponentProps> = ({
  id,
  onRemove,
}) => (
  <Card className="col-span-full md:col-span-2 lg:col-span-1 min-h-[400px] bg-gradient-to-br from-white to-emerald-50 dark:from-gray-900 dark:to-emerald-900 border-0 shadow-lg rounded-2xl transition-all duration-500 hover:shadow-xl">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
            <Map className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Regional Performance
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Performance by region
            </p>
          </div>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-0">
      <div className="h-72 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-green-900 dark:via-emerald-800 dark:to-teal-800 rounded-xl flex items-center justify-center border-2 border-dashed border-emerald-300 dark:border-emerald-600">
        <div className="text-center">
          <Map className="w-16 h-16 mx-auto mb-4 text-emerald-600 dark:text-emerald-400" />
          <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
            Choropleth Map
          </p>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-3 inline-block">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Performance by Region
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Heat Map Visualization
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-200 rounded"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Medium
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-600 rounded"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
