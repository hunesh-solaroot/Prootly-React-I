import { useState ,useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';

// Define the structure for a column that can be added
export interface AvailableColumn {
  key: string;
  label: string;
  description: string;
}

interface AddColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableColumns: AvailableColumn[];
  onAddColumns: (selectedKeys: string[]) => void;
  hiddenColumns?: Set<string>;
}

export function AddColumnModal({ isOpen, onClose, availableColumns, onAddColumns, hiddenColumns }: AddColumnModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());

  const handleToggleColumn = (key: string) => {
    const newSelection = new Set(selectedColumns);
    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }
    setSelectedColumns(newSelection);
  };

  const handleAddClick = () => {
    onAddColumns(Array.from(selectedColumns));
    setSelectedColumns(new Set()); // Reset selection after adding
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 p-0 overflow-hidden">
        <DialogHeader className="bg-[#28a745] px-6 py-6">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-black">
            <Plus className="w-5 h-5 text-black" />
            Add Column
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Select columns to add to the table:
          </p>
          <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
            {availableColumns.length > 0 ? (
              availableColumns.map((col) => (
                <div
                  key={col.key}
                  className="flex items-start space-x-3 rounded-lg border border-gray-300 dark:border-gray-600 p-4 cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  onClick={() => handleToggleColumn(col.key)}
                >
                  <Checkbox
                    id={col.key}
                    checked={selectedColumns.has(col.key)}
                    onCheckedChange={() => handleToggleColumn(col.key)}
                    className="mt-0.5"
                  />
                  <label htmlFor={col.key} className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">{col.label}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{col.description}</div>
                  </label>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p className="text-4xl mb-2">✅</p>
                <p>All available columns are already visible.</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="bg-gray-500 hover:bg-gray-600 text-white">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleAddClick}
            disabled={selectedColumns.size === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Selected Columns
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}