import React from 'react';
import { useDisclosure } from '../../hooks/useDisclosure';

type Props = {
  onCreate: () => void;
  onUpload: () => void;
  search: string;
  onSearchChange: (v: string) => void;
  onToggleFilters: () => void;
  filtersApplied?: boolean;
};

export default function PlansetNavbar({
  onCreate, onUpload, search, onSearchChange, onToggleFilters, filtersApplied
}: Props) {
  const { open, onToggle } = useDisclosure(false);

  return (
    <div className="fixed top-[110px] left-[135px] right-[18px] z-40 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between gap-6 px-4 py-2">
        <div className="relative">
          <button
            className="inline-flex items-center gap-2 rounded-[22px] bg-yellow-400 text-black font-semibold px-4 py-2 hover:bg-yellow-500 transition"
            onClick={onToggle}
          >
            <span className="w-6 h-6 rounded-full bg-white text-yellow-600 grid place-content-center font-bold shadow">+</span>
            <span className="text-sm font-semibold">Planset</span>
          </button>

          {open && (
            <div className="absolute left-0 mt-1 min-w-40 rounded-lg bg-white dark:bg-slate-800 shadow-2xl p-1 z-50">
              <button 
                className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-green-600 hover:text-white" 
                onClick={() => { onToggle(); onCreate(); }}
              >
                Create
              </button>
              <button 
                className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-green-600 hover:text-white" 
                onClick={() => { onToggle(); onUpload(); }}
              >
                Upload
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 w-[300px] max-w-[300px]">
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="flex-1 rounded-[18px] border-2 border-green-500 px-3 py-2 text-sm focus:ring-0 focus:border-green-600 shadow-none dark:bg-slate-800 dark:text-white"
            />
          </div>

          <button
            onClick={onToggleFilters}
            className={`relative bg-gradient-to-br from-emerald-500 to-green-600 text-white font-semibold px-3 py-2 rounded-lg hover:shadow-md ${filtersApplied ? 'from-yellow-500 to-yellow-600 shadow-md' : ''}`}
          >
            Filters
            {filtersApplied && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
