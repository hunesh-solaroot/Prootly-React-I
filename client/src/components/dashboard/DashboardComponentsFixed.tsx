import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity, 
  Users, 
  DollarSign, 
  Calendar, 
  Zap,
  Grid3X3,
  X
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

// Sample data
const sampleKPIData = [
  { title: "Active Projects", value: "124", change: "+12%", isPositive: true, icon: Activity },
  { title: "Team Members", value: "48", change: "+3", isPositive: true, icon: Users },
  { title: "Monthly Revenue", value: "$892K", change: "+18%", isPositive: true, icon: DollarSign },
  { title: "Avg Completion", value: "87%", change: "-2%", isPositive: false, icon: Calendar }
];

const sampleLineData = [
  { month: "Jan", solar: 45, wind: 38, hydro: 22 },
  { month: "Feb", solar: 52, wind: 42, hydro: 28 },
  { month: "Mar", solar: 48, wind: 39, hydro: 25 },
  { month: "Apr", solar: 61, wind: 47, hydro: 31 },
  { month: "May", solar: 55, wind: 44, hydro: 29 },
  { month: "Jun", solar: 67, wind: 51, hydro: 35 }
];

const sampleBarData = [
  { category: "Solar", value: 67 },
  { category: "Wind", value: 51 },
  { category: "Hydro", value: 35 },
  { category: "Geothermal", value: 28 }
];

const sampleDonutData = [
  { name: "Solar", value: 40, color: "#00a15d" },
  { name: "Wind", value: 30, color: "#f5c518" },
  { name: "Hydro", value: 20, color: "#3b82f6" },
  { name: "Other", value: 10, color: "#8b5cf6" }
];

const sampleAreaData = [
  { month: "Jan", efficiency: 78 },
  { month: "Feb", efficiency: 82 },
  { month: "Mar", efficiency: 79 },
  { month: "Apr", efficiency: 85 },
  { month: "May", efficiency: 88 },
  { month: "Jun", efficiency: 91 }
];

const sampleTableData = [
  { id: 1, project: "Solar Farm Alpha", client: "GreenTech Corp", status: "Active", budget: "$450K" },
  { id: 2, project: "Wind Installation Beta", client: "EcoEnergy Ltd", status: "Review", budget: "$680K" },
  { id: 3, project: "Hydro Plant Gamma", client: "CleanPower Inc", status: "Completed", budget: "$920K" },
  { id: 4, project: "Solar Rooftop Delta", client: "SustainaCorp", status: "Planning", budget: "$320K" }
];

interface DashboardComponentProps {
  id: string;
  onRemove?: (id: string) => void;
}

export const KPIComponent: React.FC<DashboardComponentProps> = ({ id, onRemove }) => (
  <Card className="col-span-full bg-card border border-border shadow-sm rounded-xl transition-colors duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-3">
      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
        <div className="p-2 bg-[#00a15d] rounded-lg">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        Key Performance Indicators
      </CardTitle>
      {onRemove && (
        <Button variant="ghost" size="sm" onClick={() => onRemove(id)} data-testid={`button-remove-${id}`} className="hover:bg-muted text-muted-foreground">
          <X className="w-4 h-4" />
        </Button>
      )}
    </CardHeader>
    <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sampleKPIData.map((kpi, index) => (
          <div key={index} className="p-4 bg-muted border border-border rounded-xl transition-colors hover:bg-muted/80">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">{kpi.title}</h4>
              <div className="p-1 bg-emerald-100 dark:bg-[#00a15d]/20 rounded-lg">
                <kpi.icon className="w-4 h-4 text-emerald-600 dark:text-[#00a15d]" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                kpi.isPositive ? 'text-emerald-600 dark:text-[#00a15d]' : 'text-red-500'
              }`}>
                {kpi.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const DonutComponent: React.FC<DashboardComponentProps> = ({ id, onRemove }) => (
  <Card className="col-span-full md:col-span-1 bg-card border border-border shadow-sm rounded-xl transition-colors duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-3">
      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
        <div className="p-2 bg-[#00a15d] rounded-lg">
          <PieChart className="w-5 h-5 text-white" />
        </div>
        Energy Distribution
      </CardTitle>
      {onRemove && (
        <Button variant="ghost" size="sm" onClick={() => onRemove(id)} data-testid={`button-remove-${id}`} className="hover:bg-muted text-muted-foreground">
          <X className="w-4 h-4" />
        </Button>
      )}
    </CardHeader>
    <CardContent className="p-6">
      <ResponsiveContainer width="100%" height={200}>
        <RechartsPieChart>
          <Pie
            data={sampleDonutData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {sampleDonutData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--popover-foreground))'
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-4">
        {sampleDonutData.map((item, index) => (
          <div key={index} className="flex items-center gap-2 px-2 py-1 bg-muted rounded-lg">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-xs font-medium text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const LineComponent: React.FC<DashboardComponentProps> = ({ id, onRemove }) => (
  <Card className="col-span-full md:col-span-2 bg-card border border-border shadow-sm rounded-xl transition-colors duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-3">
      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
        <div className="p-2 bg-[#00a15d] rounded-lg">
          <LineChart className="w-5 h-5 text-white" />
        </div>
        Energy Production Trends
      </CardTitle>
      {onRemove && (
        <Button variant="ghost" size="sm" onClick={() => onRemove(id)} data-testid={`button-remove-${id}`} className="hover:bg-muted text-muted-foreground">
          <X className="w-4 h-4" />
        </Button>
      )}
    </CardHeader>
    <CardContent className="p-6">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={sampleLineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="hsl(var(--muted-foreground) / 0.2)" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--popover-foreground))'
            }}
          />
          <Line type="monotone" dataKey="solar" stroke="#00a15d" strokeWidth={3} dot={{ fill: '#00a15d', strokeWidth: 0, r: 4 }} />
          <Line type="monotone" dataKey="wind" stroke="#f5c518" strokeWidth={3} dot={{ fill: '#f5c518', strokeWidth: 0, r: 4 }} />
          <Line type="monotone" dataKey="hydro" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const TableComponent: React.FC<DashboardComponentProps> = ({ id, onRemove }) => (
  <Card className="col-span-full bg-card border border-border shadow-sm rounded-xl transition-colors duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-3">
      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
        <div className="p-2 bg-[#00a15d] rounded-lg">
          <Grid3X3 className="w-5 h-5 text-white" />
        </div>
        Projects Overview
      </CardTitle>
      {onRemove && (
        <Button variant="ghost" size="sm" onClick={() => onRemove(id)} data-testid={`button-remove-${id}`} className="hover:bg-muted text-muted-foreground">
          <X className="w-4 h-4" />
        </Button>
      )}
    </CardHeader>
    <CardContent className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Project</th>
              <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Client</th>
              <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Status</th>
              <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Budget</th>
            </tr>
          </thead>
          <tbody>
            {sampleTableData.map((row) => (
              <tr key={row.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="p-3 font-medium text-foreground">{row.project}</td>
                <td className="p-3 text-muted-foreground">{row.client}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    row.status === 'Active' ? 'bg-emerald-100 dark:bg-[#00a15d]/20 text-emerald-700 dark:text-[#00a15d]' :
                    row.status === 'Review' ? 'bg-yellow-100 dark:bg-[#f5c518]/20 text-yellow-700 dark:text-[#f5c518]' :
                    row.status === 'Completed' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="p-3 font-semibold text-foreground">{row.budget}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export const BarComponent: React.FC<DashboardComponentProps> = ({ id, onRemove }) => (
  <Card className="col-span-full md:col-span-1 bg-card border border-border shadow-sm rounded-xl transition-colors duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-3">
      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
        <div className="p-2 bg-[#00a15d] rounded-lg">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        Energy Sources
      </CardTitle>
      {onRemove && (
        <Button variant="ghost" size="sm" onClick={() => onRemove(id)} data-testid={`button-remove-${id}`} className="hover:bg-muted text-muted-foreground">
          <X className="w-4 h-4" />
        </Button>
      )}
    </CardHeader>
    <CardContent className="p-6">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={sampleBarData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="hsl(var(--muted-foreground) / 0.2)" />
          <XAxis 
            type="number" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis 
            dataKey="category" 
            type="category" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--popover-foreground))'
            }}
          />
          <Bar 
            dataKey="value" 
            fill="#00a15d" 
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const ProgressBarComponent: React.FC<DashboardComponentProps> = ({ id, onRemove }) => (
  <Card className="col-span-full bg-card border border-border shadow-sm rounded-xl transition-colors duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-3">
      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
        <div className="p-2 bg-[#00a15d] rounded-lg">
          <Activity className="w-5 h-5 text-white" />
        </div>
        Project Progress
      </CardTitle>
      {onRemove && (
        <Button variant="ghost" size="sm" onClick={() => onRemove(id)} data-testid={`button-remove-${id}`} className="hover:bg-muted text-muted-foreground">
          <X className="w-4 h-4" />
        </Button>
      )}
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-4">
        {[
          { name: "Solar Installation Alpha", progress: 85, category: "Installation" },
          { name: "Wind Farm Design Beta", progress: 60, category: "Design" },
          { name: "Battery Storage Gamma", progress: 95, category: "Storage" },
          { name: "Grid Integration Delta", progress: 40, category: "Integration" }
        ].map((project, index) => (
          <div key={index} className="p-4 bg-muted border border-border rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="font-semibold text-foreground">{project.name}</span>
                <p className="text-xs text-muted-foreground">{project.category}</p>
              </div>
              <span className="text-lg font-bold text-[#00a15d]">{project.progress}%</span>
            </div>
            <Progress 
              value={project.progress} 
              className="h-2 bg-border"
            />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const AreaComponent: React.FC<DashboardComponentProps> = ({ id, onRemove }) => (
  <Card className="col-span-full md:col-span-2 bg-card border border-border shadow-sm rounded-xl transition-colors duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-3">
      <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
        <div className="p-2 bg-[#00a15d] rounded-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        Efficiency Trends
      </CardTitle>
      {onRemove && (
        <Button variant="ghost" size="sm" onClick={() => onRemove(id)} data-testid={`button-remove-${id}`} className="hover:bg-muted text-muted-foreground">
          <X className="w-4 h-4" />
        </Button>
      )}
    </CardHeader>
    <CardContent className="p-6">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={sampleAreaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="hsl(var(--muted-foreground) / 0.2)" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--popover-foreground))'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="efficiency" 
            stroke="#00a15d" 
            fill="url(#colorEfficiency)" 
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00a15d" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00a15d" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);