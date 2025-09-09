import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
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
import { IPlanset, ColumnTextModes } from '@shared/types';

interface ProjectRowProps {
  project: IPlanset;
  columns: ColumnConfig[];
  onShowActivity: (projectId: string) => void;
  columnTextModes: ColumnTextModes;
  hiddenColumns: Set<keyof IPlanset | 'customer'>;
}

export function ProjectRow({ project, columnTextModes, hiddenColumns,onShowActivity }: ProjectRowProps) {
  const getStatusVariant = (
    status: IPlanset['status']
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (status === 'IN PROGRESS') return 'default';
    if (status === 'COMPLETED') return 'secondary';
    if (status === 'ON HOLD') return 'destructive';
    return 'outline';
  };

  const getTextStyle = (column: keyof ColumnTextModes) => {
    const mode = columnTextModes[column];
    return mode === 'wrap'
      ? 'whitespace-normal break-words'
      : mode === 'clip'
        ? 'truncate'
        : '';
  };

  const [open, setOpen] = useState(false);

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-700/50 border-0">
      {!hiddenColumns.has('customer') && (
        <TableCell className="border-0 pl-6">
          <div className="flex items-center space-x-3">
            <div
              className="w-[75px] h-[75px] rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: project.customer.color }}
            >
              {project.customer.initials}
            </div>
            <div>
              <div className={`font-bold text-gray-900 dark:text-gray-100 ${getTextStyle('customer')}`}>{project.customer.name}</div>
              <div className={`text-sm text-gray-500 dark:text-gray-400 ${getTextStyle('customer')}`}>{project.customer.type}</div>
              <div className={`text-[13px] text-gray-400 ${getTextStyle('customer')}`}>{project.customer.address}</div>
            </div>
          </div>
        </TableCell>
      )}

      {!hiddenColumns.has('projectDetails') && (
        <TableCell className={`font-medium border-0 px-4 ${getTextStyle('projectDetails')}`}>{project.projectDetails}</TableCell>
      )}

      {!hiddenColumns.has('keyDates') && (
        <TableCell className="border-0 px-4">
          <div className={`text-sm ${getTextStyle('keyDates')}`}>
            <div><span className="font-semibold text-gray-500 dark:text-gray-400">Created:</span> {project.keyDates.created}</div>
            <div><span className="font-semibold text-gray-500 dark:text-gray-400">Received:</span> {project.keyDates.received}</div>
          </div>
        </TableCell>
      )}

      {!hiddenColumns.has('status') && (
        <TableCell className="border-0 px-4">
          <div className="flex flex-col space-y-1 items-start">
            <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
            {project.priority && <Badge variant="destructive">{project.priority}</Badge>}
          </div>
        </TableCell>
      )}

      {!hiddenColumns.has('assignedTo') && (
        <TableCell className={`text-gray-500 dark:text-gray-400 italic border-0 px-4 ${getTextStyle('assignedTo')}`}>{project.assignedTo || 'Not assigned'}</TableCell>
      )}

      {!hiddenColumns.has('countdown') && (
        <TableCell className="border-0 px-4">
          <div className={`font-semibold ${getTextStyle('countdown')}`}>{project.countdown}</div>
          <div className={`text-xs text-gray-400 ${getTextStyle('countdown')}`}>{project.autoComplete}</div>
        </TableCell>
      )}

      {!hiddenColumns.has('budget') && (
        <TableCell className={`border-0 px-4 ${getTextStyle('budget')}`}>
          {project.budget ? `$${project.budget.toLocaleString()}` : 'Not set'}
        </TableCell>
      )}

      {!hiddenColumns.has('estimatedHours') && (
        <TableCell className={`border-0 px-4 ${getTextStyle('estimatedHours')}`}>
          {project.estimatedHours ? `${project.estimatedHours}h` : 'Not set'}
        </TableCell>
      )}

      {!hiddenColumns.has('actualHours') && (
        <TableCell className={`border-0 px-4 ${getTextStyle('actualHours')}`}>
          {project.actualHours ? `${project.actualHours}h` : 'Not set'}
        </TableCell>
      )}

      {!hiddenColumns.has('progress') && (
        <TableCell className="border-0 px-4">
          {project.progress ? (
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className={`text-sm ${getTextStyle('progress')}`}>{project.progress}%</span>
            </div>
          ) : (
            <span className="text-gray-400">Not set</span>
          )}
        </TableCell>
      )}

      {!hiddenColumns.has('tags') && (
        <TableCell className="border-0 px-4">
          {project.tags && project.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-gray-400">No tags</span>
          )}
        </TableCell>
      )}

      {!hiddenColumns.has('notes') && (
        <TableCell className={`border-0 px-4 text-gray-500 dark:text-gray-400 italic ${getTextStyle('notes')}`}>
          {project.notes || 'No notes'}
        </TableCell>
      )}

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
  );
}
