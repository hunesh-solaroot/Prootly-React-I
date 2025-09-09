import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GradeBadgeProps {
  score: number;
}

const getGradeInfo = (score: number) => {
  if (score >= 90) return {
    grade: "A",
    color: "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
    textColor: "text-white",
    description: "Excellent Performance",
    detail: "Outstanding work quality and exceptional results. Exceeds all expectations consistently.",
    bgGradient: "from-green-400 to-green-600"
  };
  if (score >= 75) return {
    grade: "B",
    color: "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
    textColor: "text-white", 
    description: "Good Performance",
    detail: "Consistently meets expectations with quality work. Shows strong competency.",
    bgGradient: "from-blue-400 to-blue-600"
  };
  if (score >= 60) return {
    grade: "C",
    color: "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700",
    textColor: "text-white",
    description: "Average Performance", 
    detail: "Meets basic requirements with room for improvement. Shows potential for growth.",
    bgGradient: "from-orange-400 to-orange-600"
  };
  return {
    grade: "D",
    color: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
    textColor: "text-white",
    description: "Needs Improvement",
    detail: "Below expectations. Requires focused development and additional support.",
    bgGradient: "from-red-400 to-red-600"
  };
};

const GradeBadge: React.FC<GradeBadgeProps> = ({ score }) => {
  const gradeInfo = getGradeInfo(score);
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          className={`${gradeInfo.color} ${gradeInfo.textColor} text-lg font-bold px-4 py-2 cursor-help transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl`}
          data-testid="grade-badge"
        >
          <span className="flex items-center gap-1">
            Grade {gradeInfo.grade}
          </span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <div className="text-center space-y-1">
          <p className="font-semibold text-base">{gradeInfo.description}</p>
          <p className="text-sm opacity-90">{gradeInfo.detail}</p>
          <p className="text-xs mt-2 opacity-75">Score: {score}/100</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default GradeBadge;