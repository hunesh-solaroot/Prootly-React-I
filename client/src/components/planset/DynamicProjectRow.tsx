import { useLocation } from "wouter";
import { useState } from "react";
import { ashiyaService } from "../../services/ashiyaService";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  MoreHorizontal,
  Edit,
  Activity,
  Trash2,
  Eye,
  Archive,
  CheckCircle,
  Users,
  AlertTriangle
} from 'lucide-react';
import { ApiHeaderConfig, DynamicProjectData } from "../../types/apiTypes";

interface DynamicProjectRowProps {
  project: DynamicProjectData;
  headers: ApiHeaderConfig[];
  hiddenColumns: Set<string>;
  columnTextModes: Record<string, "wrap" | "clip" | null>;
  onShowActivity: (projectId: string) => void;
}

export function DynamicProjectRow({
  project,
  headers,
  hiddenColumns,
  columnTextModes,
  onShowActivity,
}: DynamicProjectRowProps) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  
  // Helper function to get text mode class
  const getTextModeClass = (columnKey: string) => {
    const mode = columnTextModes[columnKey];
    return mode === "wrap" ? "text-wrap" : mode === "clip" ? "text-clip" : "";
  };

  // Helper function to handle customer name click
  const handleCustomerClick = async () => {
    try {
      // Set project context in Ashiya AI
      await ashiyaService.setProjectContext(
        project.id, 
        project.customer?.name || "Unknown Customer"
      );
      console.log(`🎯 Set Ashiya context for project ${project.id}: ${project.customer?.name}`);
    } catch (error) {
      console.error("Failed to set project context:", error);
    }
    
    // Navigate to project dashboard
    setLocation(`/project-dashboard/${project.id}`);
  };

  // Helper function to render cell content based on data type
  const renderCellContent = (header: ApiHeaderConfig, value: any) => {
    if (!value && value !== 0) return <span className="text-gray-400">Not set</span>;

    switch (header.type) {
      case "customer":
        return (
          <div className="flex items-center space-x-3">
            <div
              className="w-[75px] h-[75px] rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: value.color || "#6b7280" }}
            >
              {value.initials || "NA"}
            </div>
            <div className="min-w-0 flex-1">
              <button
                onClick={handleCustomerClick}
                className="font-bold text-gray-900 dark:text-gray-100 truncate cursor-pointer transition-colors duration-200 text-left hover:no-underline hover:text-blue-600 dark:hover:text-blue-400"
              >
                {value.name || "Unknown Customer"}
              </button>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {value.type || "Unknown Type"}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {value.address || "No Address"}
              </div>
            </div>
          </div>
        );

      case "date":
        return (
          <div className="text-sm space-y-1">
            {typeof value === "object" && value.created ? (
              <>
                <div>
                  <span className="font-semibold text-gray-500 dark:text-gray-400">
                    Created:
                  </span>{" "}
                  {value.created}
                </div>
                {value.received && (
                  <div>
                    <span className="font-semibold text-gray-500 dark:text-gray-400">
                      Received:
                    </span>{" "}
                    {value.received}
                  </div>
                )}
              </>
            ) : (
              <div>{String(value)}</div>
            )}
          </div>
        );

      case "status":
        const getStatusVariant = (
          status: string
        ): 'default' | 'secondary' | 'destructive' | 'outline' => {
          if (status === 'IN PROGRESS') return 'default';
          if (status === 'COMPLETED') return 'secondary';
          if (status === 'ON HOLD') return 'destructive';
          return 'outline';
        };
        
        return (
          <div className="flex flex-col space-y-1 items-start">
            <Badge variant={getStatusVariant(String(value))}>{String(value)}</Badge>
          </div>
        );

      case "progress":
        const progressValue = Number(value);
        if (isNaN(progressValue)) return <span className="text-gray-400">Not set</span>;
        
        return (
          <div className="flex items-center space-x-2">
            <div className="w-20 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressValue}%` }}
              />
            </div>
            <span className="text-sm font-medium">{progressValue}%</span>
          </div>
        );

      case "tags":
        if (!Array.isArray(value)) return <span className="text-gray-400">No tags</span>;
        
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {String(tag)}
              </Badge>
            ))}
          </div>
        );

      case "number":
        const numValue = Number(value);
        if (isNaN(numValue)) return <span className="text-gray-400">Not set</span>;
        
        return (
          <span>
            {header.key.includes("budget") || header.key.includes("cost") || header.key.includes("price")
              ? `$${numValue.toLocaleString()}`
              : header.key.includes("hours") || header.key.includes("time")
              ? `${numValue}h`
              : numValue.toLocaleString()}
          </span>
        );

      case "text":
      default:
        return (
          <span className={`${getTextModeClass(header.key)}`}>
            {String(value)}
          </span>
        );
    }
  };

  return (
    <>
      <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700/50 border-0 transition-colors duration-150">
        {headers.map((header) => {
          if (hiddenColumns.has(header.key)) return null;

          return (
            <TableCell
              key={header.key}
              className={`border-0 px-4 ${
                header.key === "customer" ? "pl-6" : ""
              } ${getTextModeClass(header.key)}`}
            >
              {renderCellContent(header, project[header.key])}
            </TableCell>
          );
        })}

        {/* Actions Column */}
        <TableCell className="text-right border-0 px-4">
          <TooltipProvider>
            <div className="flex flex-col items-end gap-1">
              {/* First row - 3 buttons */}
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white w-10 h-10 p-0 rounded-xl">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Edit</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white w-10 h-10 p-0 rounded-xl" onClick={() => onShowActivity(project.id)}>
                      <Activity className="w-4 h-4" /> 
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Activity</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 p-0 rounded-xl">
                      <AlertTriangle className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Hold</p></TooltipContent>
                </Tooltip>
              </div>

              {/* Second row - 3 buttons */}
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 p-0 rounded-xl">
                      <Users className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Team Lead</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 p-0 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Cancel</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white w-10 h-10 p-0 rounded-xl">
                      <AlertTriangle className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Change Priority</p></TooltipContent>
                </Tooltip>
              </div>

              {/* Third row - Auto Complete & Dropdown */}
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white w-10 h-10 p-0 rounded-xl">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Auto Complete</p></TooltipContent>
                </Tooltip>

                {/* More Options */}
                <DropdownMenu onOpenChange={setOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-gray-600 hover:bg-gray-700 text-white w-10 h-10 p-0 rounded-xl transition-transform duration-200"
                      aria-label="More options"
                    >
                      <MoreHorizontal className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-36">
                    {/* DELETE (dark hover) */}
                    <DropdownMenuItem
                      className="
                         group cursor-pointer transition-all duration-200
                          pl-3 hover:pl-4
                          text-[#dc2626]
                          hover:text-white
                          hover:bg-gradient-to-b hover:from-[#ef4444] hover:to-[#b91c1c]
                          data-[highlighted]:text-white
                          data-[highlighted]:bg-gradient-to-b
                          data-[highlighted]:from-[#ef4444]
                          data-[highlighted]:to-[#b91c1c]
                      "
                    >
                      <Trash2
                        className="
                          w-4 h-6 mr-2
                          text-[#dc2626]
                          group-hover:text-white
                          data-[highlighted]:text-white
                        "
                      />
                      <span className="group-hover:text-white data-[highlighted]:text-white">Delete</span>
                    </DropdownMenuItem>

                    {/* VIEW DETAILS (dark hover) */}
                    <DropdownMenuItem
                      className="
                          group cursor-pointer transition-all duration-200
                          pl-3 hover:pl-4
                          text-[#2563eb]
                          hover:text-white
                          hover:bg-gradient-to-b hover:from-[#3b82f6] hover:to-[#1d4ed8]
                          data-[highlighted]:text-white
                          data-[highlighted]:bg-gradient-to-b
                          data-[highlighted]:from-[#3b82f6]
                          data-[highlighted]:to-[#1d4ed8]
                      "
                    >
                      <Eye
                        className="
                          w-4 h-6 mr-2
                          text-[#2563eb]
                          group-hover:text-white
                          data-[highlighted]:text-white
                        "
                      />
                      <span className="group-hover:text-white data-[highlighted]:text-white">View Details</span>
                    </DropdownMenuItem>

                    {/* ARCHIVE (dark hover) */}
                    <DropdownMenuItem
                      className="
                       group cursor-pointer transition-all duration-200
                      pl-3 hover:pl-4
                      text-[#d97706]
                      hover:text-white
                      hover:bg-gradient-to-b hover:from-[#f59e0b] hover:to-[#b45309]
                      data-[highlighted]:text-white
                      data-[highlighted]:bg-gradient-to-b
                      data-[highlighted]:from-[#f59e0b]
                      data-[highlighted]:to-[#b45309]
                      "
                    >
                      <Archive
                        className="
                          w-4 h-6 mr-2
                          text-[#d97706]
                          group-hover:text-white
                          data-[highlighted]:text-white
                        "
                      />
                      <span className="group-hover:text-white data-[highlighted]:text-white">Archive</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </TooltipProvider>
        </TableCell>
      </TableRow>
      
      
    </>
  );
}