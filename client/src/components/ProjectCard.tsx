import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, TrendingUp, TrendingDown, CheckCircle, Clock, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  title: string;
  count: number;
  percentage?: string;
  variant?: "default" | "green" | "completed" | "hold" | "new" | "revision";
  showAll?: boolean;
  trend?: "up" | "down" | "neutral";
  trendPercentage?: string;
}

export default function ProjectCard({ 
  title, 
  count, 
  percentage, 
  variant = "default",
  showAll = false,
  trend = "neutral",
  trendPercentage 
}: ProjectCardProps) {
  const getIcon = () => {
    switch (variant) {
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      case "hold":
        return <Clock className="w-5 h-5" />;
      case "new":
        return <Plus className="w-5 h-5" />;
      case "revision":
        return <RotateCcw className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getGradientClass = () => {
    switch (variant) {
      case "completed":
        return "bg-gradient-to-br from-green-500 to-green-600";
      case "hold":
        return "bg-gradient-to-br from-yellow-500 to-orange-500";
      case "new":
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      case "revision":
        return "bg-gradient-to-br from-purple-500 to-purple-600";
      case "green":
        return "gradient-green-600";
      default:
        return "bg-white dark:bg-gray-900";
    }
  };

  const isColored = ["completed", "hold", "new", "revision", "green"].includes(variant);

  return (
    <Card className={`${getGradientClass()} ${isColored ? 'text-white' : 'bg-white dark:bg-gray-900'} hover:shadow-lg transition-all duration-200 border ${isColored ? 'border-transparent' : 'border-slate-200 dark:border-gray-700'}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {getIcon()}
            <h3 className={`font-medium ${isColored ? 'text-white/90' : 'text-slate-800 dark:text-slate-200'}`}>
              {title}
            </h3>
          </div>
          {showAll && (
            <Button variant="ghost" size="sm" className={`${isColored ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}`}>
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          <div className={`text-3xl font-bold ${isColored ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
            {count.toLocaleString()}
          </div>
          
          <div className="flex items-center justify-between">
            {percentage && (
              <div className={`text-sm ${isColored ? 'text-white/80' : 'text-slate-600 dark:text-slate-400'}`}>
                {percentage}
              </div>
            )}
            
            {trendPercentage && (
              <div className={`flex items-center gap-1 text-sm ${
                trend === "up" 
                  ? (isColored ? 'text-white/90' : 'text-green-600 dark:text-green-400')
                  : trend === "down" 
                    ? (isColored ? 'text-white/90' : 'text-red-600 dark:text-red-400')
                    : (isColored ? 'text-white/80' : 'text-slate-500 dark:text-slate-400')
              }`}>
                {trend === "up" && <TrendingUp className="w-3 h-3" />}
                {trend === "down" && <TrendingDown className="w-3 h-3" />}
                {trendPercentage}
              </div>
            )}
          </div>
          
          {showAll && (
            <div className={`text-sm ${isColored ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
              (All)
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
