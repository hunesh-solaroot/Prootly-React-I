import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, LayoutDashboard, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  KPIComponent,
  DonutComponent,
  TrendLineComponent,
  TableComponent,
  MapComponent,
  ChoroplethMapComponent,
  BarComponent,
  ColumnComponent,
  CalendarListComponent,
  CalendarCardComponent,
  ProgressBarComponent,
  type DashboardComponentProps,
} from "./DashboardComponents";

export interface DashboardItem {
  id: string;
  type: ComponentType;
  title: string;
}

export type ComponentType =
  | "kpi"
  | "donut"
  | "trend-line"
  | "table"
  | "map"
  | "choropleth-map"
  | "bar"
  | "column"
  | "calendar-list"
  | "calendar-card"
  | "progress-bar";

const componentOptions: {
  type: ComponentType;
  label: string;
  description: string;
}[] = [
  { type: "kpi", label: "KPI", description: "Key Performance Indicators" },
  { type: "donut", label: "Donut", description: "Donut/Pie Chart" },
  {
    type: "trend-line",
    label: "Trend Line",
    description: "Line Chart for Trends",
  },
  { type: "table", label: "Table", description: "Data Table" },
  { type: "map", label: "Map", description: "Geographic Map" },
  {
    type: "choropleth-map",
    label: "Choropleth Map",
    description: "Regional Heat Map",
  },
  { type: "bar", label: "Bar", description: "Horizontal Bar Chart" },
  { type: "column", label: "Column", description: "Vertical Column Chart" },
  {
    type: "calendar-list",
    label: "Calendar List",
    description: "Event List View",
  },
  {
    type: "calendar-card",
    label: "Calendar Card",
    description: "Calendar Grid View",
  },
  {
    type: "progress-bar",
    label: "Progress Bar",
    description: "Progress Indicators",
  },
];

const componentMap: Record<ComponentType, React.FC<DashboardComponentProps>> = {
  kpi: KPIComponent,
  donut: DonutComponent,
  "trend-line": TrendLineComponent,
  table: TableComponent,
  map: MapComponent,
  "choropleth-map": ChoroplethMapComponent,
  bar: BarComponent,
  column: ColumnComponent,
  "calendar-list": CalendarListComponent,
  "calendar-card": CalendarCardComponent,
  "progress-bar": ProgressBarComponent,
};

// Draggable wrapper component for dashboard items
interface DraggableComponentProps {
  item: DashboardItem;
  onRemove: (id: string) => void;
  isDragging?: boolean;
}

function DraggableComponent({
  item,
  onRemove,
  isDragging,
}: DraggableComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id });

  // Only apply transform and transition, preserve all original styling
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.8 : 1,
  };

  const Component = componentMap[item.type];
  if (!Component) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
      data-testid={`draggable-${item.id}`}
    >
      {/* Minimal Drag Handle - positioned to not interfere with component */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 right-1 z-20 p-1.5 bg-white/95 dark:bg-[#202020]/95 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-md cursor-grab hover:bg-gray-50 dark:hover:bg-[#2a2a2a] opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm"
        data-testid={`drag-handle-${item.id}`}
        title="Drag to reorder"
      >
        <GripVertical className="w-3 h-3 text-gray-600 dark:text-gray-400" />
      </div>

      {/* Component renders with original dimensions and styling */}
      <Component id={item.id} onRemove={onRemove} />
    </div>
  );
}

// Drop zone for removing components
interface TrashDropZoneProps {
  isOver: boolean;
}

function TrashDropZone({ isOver }: TrashDropZoneProps) {
  const { isOver: isOverDrop, setNodeRef } = useDroppable({
    id: 'trash-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-16 h-16 rounded-xl border-2 border-dashed transition-all duration-300 flex items-center justify-center backdrop-blur-sm ${
        isOver || isOverDrop
          ? "border-red-500 bg-red-500/20 scale-110 shadow-lg shadow-red-500/30"
          : "border-gray-400 dark:border-gray-600 bg-white/90 dark:bg-[#2a2a2a]/90"
      }`}
      data-testid="trash-drop-zone"
      title="Drop here to remove component"
    >
      <Trash2
        className={`w-5 h-5 transition-all duration-300 ${
          isOver || isOverDrop
            ? "text-red-500 scale-110" 
            : "text-gray-500 dark:text-gray-400"
        }`}
      />
    </div>
  );
}

const STORAGE_KEY = "solaroot-dashboard-layout";

export default function DynamicDashboard() {
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);

  // Load dashboard layout from localStorage on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem(STORAGE_KEY);
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        setDashboardItems(parsedLayout);
      } catch (error) {
        console.error("Failed to parse saved dashboard layout:", error);
        // Fall back to default layout
        setDashboardItems([
          { id: "kpi-1", type: "kpi", title: "KPI Overview" },
          { id: "trend-1", type: "trend-line", title: "Revenue Trend" },
          { id: "donut-1", type: "donut", title: "Project Status" },
          { id: "table-1", type: "table", title: "Projects Table" },
        ]);
      }
    } else {
      // Default layout for first-time users
      setDashboardItems([
        { id: "kpi-1", type: "kpi", title: "KPI Overview" },
        { id: "trend-1", type: "trend-line", title: "Revenue Trend" },
        { id: "donut-1", type: "donut", title: "Project Status" },
        { id: "table-1", type: "table", title: "Projects Table" },
      ]);
    }
  }, []);

  // Save dashboard layout to localStorage whenever items change
  useEffect(() => {
    if (dashboardItems.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboardItems));
    }
  }, [dashboardItems]);

  // Drag and drop sensors - simplified for better compatibility
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addComponent = (type: ComponentType) => {
    const newId = `${type}-${Date.now()}`;
    const option = componentOptions.find((opt) => opt.type === type);
    const newItem: DashboardItem = {
      id: newId,
      type,
      title: option?.label || type,
    };
    setDashboardItems((prev) => [...prev, newItem]);
  };

  const removeComponent = (id: string) => {
    setDashboardItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Drag event handlers
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;
    setIsOverTrash(over?.id === "trash-zone");
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);
    setIsOverTrash(false);

    if (!over || !active) return;

    // Handle dropping in trash zone - fix the ID matching
    if (over.id === "trash-zone") {
      console.log("Removing component:", active.id);
      removeComponent(active.id as string);
      return;
    }

    // Handle reordering - only if both items exist
    if (active.id !== over.id) {
      setDashboardItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  }

  const renderComponent = (item: DashboardItem) => {
    return (
      <DraggableComponent
        key={item.id}
        item={item}
        onRemove={removeComponent}
        isDragging={activeId === item.id}
      />
    );
  };

  // Get the active item for drag overlay
  const activeItem = dashboardItems.find((item) => item.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-[#161717] p-6 space-y-6 transition-colors duration-300">
        {/* Dashboard Header */}
        <Card className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl transition-colors duration-300">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#00a15d] rounded-xl">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Solaroot Analytics
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Professional renewable energy management
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="gap-2 bg-[#00a15d] hover:bg-[#008a4f] text-white font-medium px-4 py-2 rounded-lg transition-colors"
                      data-testid="button-add-component"
                    >
                      <Plus className="w-4 h-4" />
                      Add Component
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {componentOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.type}
                        onClick={() => addComponent(option.type)}
                        className="flex flex-col items-start gap-1 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                        data-testid={`menu-item-${option.type}`}
                      >
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {option.description}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-[#00a15d]/10 border border-emerald-200 dark:border-[#00a15d]/20 rounded-lg">
                <div className="w-2 h-2 bg-[#00a15d] rounded-full"></div>
                <span className="text-sm font-medium text-emerald-700 dark:text-[#00a15d]">
                  Active: {dashboardItems.length}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-[#333333] border border-slate-200 dark:border-[#404040] rounded-lg">
                <div className="w-2 h-2 bg-slate-400 dark:bg-[#808080] rounded-full"></div>
                <span className="text-sm font-medium text-slate-600 dark:text-[#b0b0b0]">
                  Available: {componentOptions.length - dashboardItems.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Grid with Sortable Context */}
        {dashboardItems.length > 0 ? (
          <SortableContext
            items={dashboardItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {dashboardItems.map(renderComponent)}
            </div>
          </SortableContext>
        ) : (
          <Card className="bg-white dark:bg-[#202020] border border-slate-200 dark:border-[#333333] shadow-sm rounded-xl transition-colors duration-300">
            <CardContent className="text-center py-12">
              <div className="p-4 bg-emerald-50 dark:bg-[#00a15d]/10 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <LayoutDashboard className="w-8 h-8 text-emerald-600 dark:text-[#00a15d]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-[#f0f0f0] mb-2">
                Build Your Dashboard
              </h3>
              <p className="text-slate-600 dark:text-[#b0b0b0] mb-6 max-w-sm mx-auto">
                Add components to create your renewable energy analytics view.
                Drag and drop to reorder.
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="gap-2 bg-[#00a15d] hover:bg-[#008a4f] text-white font-medium px-4 py-2 rounded-lg"
                    data-testid="button-add-first-component"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Component
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-56 bg-white dark:bg-[#2a2a2a] border-slate-200 dark:border-[#333333] text-slate-900 dark:text-[#f0f0f0]"
                >
                  {componentOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.type}
                      onClick={() => addComponent(option.type)}
                      className="flex flex-col items-start gap-1 p-3 hover:bg-slate-100 dark:hover:bg-[#333333] focus:bg-slate-100 dark:focus:bg-[#333333]"
                    >
                      <div className="font-medium text-slate-900 dark:text-[#f0f0f0]">
                        {option.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-[#808080]">
                        {option.description}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Trash Drop Zone */}
      {activeId && (
        <div className="fixed bottom-8 right-8 z-50">
          <TrashDropZone isOver={isOverTrash} />
        </div>
      )}

      {/* Drag Overlay - preserves exact component dimensions */}
      <DragOverlay>
        {activeId && activeItem ? (
          <div className="shadow-2xl shadow-black/30 dark:shadow-black/50 rotate-1">
            {/* Render component without drag handle in overlay */}
            {(() => {
              const Component = componentMap[activeItem.type];
              return Component ? (
                <Component id={activeItem.id} onRemove={() => {}} />
              ) : null;
            })()}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
