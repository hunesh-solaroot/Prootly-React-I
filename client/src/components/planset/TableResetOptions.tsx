import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RotateCcw, Settings, Filter, Type, Eye, Grid } from 'lucide-react';

interface TableResetOptionsProps {
  onReset?: (action: string) => void;
}

export function TableResetOptions({ onReset }: TableResetOptionsProps) {
  if (!onReset) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-3 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Settings className="w-4 h-4 mr-2" />
          Reset Options
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Table Reset Options</h4>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-left font-normal"
            onClick={() => onReset('everything')}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Everything
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-left font-normal"
            onClick={() => onReset('filters')}
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters & Sort
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-left font-normal"
            onClick={() => onReset('columns')}
          >
            <Grid className="w-4 h-4 mr-2" />
            Reset Column Widths
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-left font-normal"
            onClick={() => onReset('textmode')}
          >
            <Type className="w-4 h-4 mr-2" />
            Reset Text Display
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-left font-normal"
            onClick={() => onReset('showall')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Show All Columns
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}